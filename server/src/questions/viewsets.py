from django.db.models import Q
from rest_framework.response import Response # to allow response from external api thingies like POSTMAN
from rest_framework import status # allow status responses
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Exists, OuterRef
from django.db.utils import IntegrityError
from django.shortcuts import get_object_or_404
from django.utils import timezone
from users.utils import get_current_term
from django.db.models import Avg
from users.models import User, Course, Programme, Grade, Term
from rest_framework import viewsets, permissions, mixins, filters
from .models import Question, Choice, Test, StudentAnswer, StudentTestSession
from .serializers import QuestionSerializer, TestSerializer, TestSerializerForTest, StudentTestSessionSerializer, StudentAnswerSerializer, TestListSerializer, TestDetailSerializer, TestSubmissionSerializer, StudentAnswerDetailSerializer, QuestionWithAnswerSerializer


class QuestionViewSet(viewsets.ModelViewSet):
	permission_classes = [AllowAny]
	queryset = Question.objects.all()
	serializer_class = QuestionSerializer

	def perform_create(self, serializer):
		question = serializer.save()
		if question.question_type not in ['MCQ', 'TF']:
			# If not MCQ or TF, remove any existing choices
			question.choices.all().delete()

	def perform_update(self, serializer):
		question = serializer.save()
		if question.question_type not in ['MCQ', 'TF']:
			# If updated to a type other than MCQ or TF, remove choices
			question.choices.all().delete()

	@action(detail=True, methods=['post'], url_path='set-correct-answer')
	def set_correct_answer(self, request, pk=None):
		question = self.get_object()
		correct_answer = request.data.get("correct_answer")

		if correct_answer not in ['True', 'False']:
			return Response({'error': 'Invalid answer'}, status=status.HTTP_400_BAD_REQUEST)

		for choice in question.choices.all():
			choice.is_correct = choice.content == correct_answer
			choice.save()

		return Response({'message': 'Correct answer updated'})

class TestViewSet(viewsets.ModelViewSet):
	permission_classes = [AllowAny]
	queryset = Test.objects.all()
	serializer_class = TestSerializer

	def get_queryset(self):
		queryset = super().get_queryset()
		course_id = self.request.query_params.get('course', None)
		search = self.request.query_params.get('search', None)

		if course_id:
			queryset = queryset.filter(course__id=course_id)

		if search:
			queryset = queryset.filter(
				Q(title__icontains=search) |
				Q(course__name__icontains=search) |
				Q(programme__name__icontains=search) |
				Q(grade__grade__icontains=search) |
				Q(term__term__icontains=search)
			)
		return queryset

class StudentTestSessionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StudentTestSession.objects.all()
    serializer_class = StudentTestSessionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        test_id = self.request.query_params.get('test_id')
        if test_id:
            queryset = queryset.filter(test__id=test_id)
        return queryset

class TestListViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Test.objects.all()
	serializer_class = TestListSerializer

	def get_queryset(self):
		student = self.request.user
		current_programme = student.programme
		current_grade = student.grade  # Assuming you have a grade field in StudentProfile
		current_term = get_current_term()  # Implement this function based on your logic

		return Test.objects.filter(programme=current_programme, grade=current_grade, term=current_term)

class TestDetailViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Test.objects.all()
	serializer_class = TestSerializer

class TestSessionViewSet(viewsets.ViewSet):
	permission_classes = [permissions.IsAuthenticated]

	def list(self, request):
		test_id = request.query_params.get('test_id')
		if not test_id:
			return Response({'error': 'Test ID is required'}, status=status.HTTP_400_BAD_REQUEST)

		test_sessions = StudentTestSession.objects.filter(test_id=test_id)
		serializer = StudentTestSessionSerializer(test_sessions, many=True, context={'request': request})
		return Response(serializer.data)

	@action(detail=True, methods=['post'])
	def start_test(self, request, pk=None):
		user = request.user
		#student_profile = StudentProfile.objects.filter(user=user).first()
		#if not student_profile:
		#	return Response({"error": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

		test = get_object_or_404(Test, pk=pk)
		current_term = get_current_term()

		# Check if current time is within the test availability window
		current_time = timezone.now()
		if not (test.start_time <= current_time <= test.end_time):
			return Response({"error": "This test is not accessible at the moment."}, status=status.HTTP_400_BAD_REQUEST)

		# Verify that the test's programme, grade, and term match the student's
		#if test.programme != user.programme or test.grade != user.grade or test.term != current_term:
		#	raise PermissionDenied("You are not eligible to start this test.")

		# Create a new test session if it does not exist
		test_session, created = StudentTestSession.objects.get_or_create(
			student=user,
			test=test
		)


		if created:
			test_session.start_time = timezone.now()
			test_session.save()

		elapsed_time = (current_time - test_session.start_time).total_seconds() // 60
		remaining_time = test.max_time - elapsed_time
		if remaining_time <= 0:
			return Response({"error": "The time limit for this test session has been exceeded."}, status=status.HTTP_400_BAD_REQUEST)

		# Serialize the test details to send back to the student
		serializer = TestSerializerForTest(test, context={'request': request})

		# Optionally add extra data to the response, like remaining time
		response_data = serializer.data

		# Calculate remaining time only if the test session has started
		if test_session.start_time:
			elapsed_time = timezone.now() - test_session.start_time
			remaining_time = max(test.max_time - int(elapsed_time.total_seconds() / 60), 0)
		else:
			remaining_time = test.max_time

		# Add remaining time to the response data
		response_data['remaining_time'] = remaining_time
		response_data['test_session_id'] = test_session.id

		return Response(response_data)

class SubmitTestViewSet(viewsets.GenericViewSet):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = TestSubmissionSerializer

	def create(self, request, *args, **kwargs):
		serializer = TestSubmissionSerializer(data=request.data, context={'request': request, 'user': request.user})
		if serializer.is_valid():
			try:
				# Attempt to create the student answers
				serializer.save()
				return Response({"message": "Test submitted successfully"}, status=status.HTTP_201_CREATED)
			except ValidationError as e:
				# Return validation error response
				return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)	
			except Question.DoesNotExist:
				# Handle the case where the Question does not exist
				return Response({"error": "Question with provided sequence number does not exist."}, status=status.HTTP_400_BAD_REQUEST)
			except Choice.DoesNotExist:
				# Handle the case where the Choice does not exist
				return Response({"error": "Choice with provided sequence number does not exist."}, status=status.HTTP_400_BAD_REQUEST)
			except IntegrityError as e:
				# Handle any other integrity issues, such as duplicate submissions
				return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
		else:
			# Return validation errors if serializer is not valid
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubmittedTestsViewSet(viewsets.ReadOnlyModelViewSet):
	permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
	serializer_class = StudentAnswerDetailSerializer
	lookup_field = 'test_id'

	def get_queryset(self):
		# Assuming you want to get all answers for a particular test
		test_id = self.kwargs.get('test_id')
		if test_id is not None:
			return StudentAnswer.objects.filter(test_id=test_id)
		else:
			# If no test_id is provided, return none or all answers depending on your requirement
			return StudentAnswer.objects.none()  # Or return all answers

	def retrieve(self, request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		
		# Include text answers in the serialized data
		for answer in data.get('answers', []):
			if answer['question']['question_type'] in ['SA', 'ESSAY']:
				text_answer = StudentAnswer.objects.filter(
					question_id=answer['question']['id'],
					student=request.user,
				).first().text_answer
				answer['text_answer'] = text_answer

		return Response(data)



	@action(detail=False, methods=['get'])
	def list_eligible(self, request):
		# This will return tests with at least one answer submitted
		tests_with_answers = Test.objects.annotate(
			has_answers=Exists(StudentAnswer.objects.filter(test=OuterRef('pk')))
		).filter(has_answers=True)

		# Pass the request context to the serializer
		serializer = TestListSerializer(tests_with_answers, many=True, context={'request': request})
		return Response(serializer.data)


class TestHistoryViewSet(viewsets.ReadOnlyModelViewSet): # Endpoint for showing all the tests done(test history) by a particular student(user).
	serializer_class = StudentTestSessionSerializer

	def get_queryset(self):
		user_id = self.kwargs.get('user_id') 
		if user_id is not None:
			# Return the test sessions for the logged-in user
			return StudentTestSession.objects.filter(student__id=user_id).order_by('-start_time')
		return StudentTestSession.objects.none() # Path to endpoint : 'api/questions/users/<int:user_id>/test-history/'

class TestResultsViewSet(viewsets.ReadOnlyModelViewSet): # Endpoint for the test sessions that have being created by students on a particular test and can be used by the frontend to display the work(test session) done by students on a particular test the staff that created the staff
	serializer_class = StudentTestSessionSerializer

	def get_queryset(self):
		test_id = self.kwargs['test_id']
		if test_id is not None:
			# Return the test sessions for the test
			return StudentTestSession.objects.filter(test__id=test_id)
		return StudentTestSession.objects.none() # Path to endpoint : 'api/questions/tests/<int:test_id>/test-results/'

class TestAnswersViewSet(viewsets.ReadOnlyModelViewSet): # Endpoint for displaying all the answers submitted by students for a particular test.
	serializer_class = StudentAnswerSerializer

	def get_queryset(self):
		test_id = self.kwargs['test_id']
		if test_id is not None:
			# Return the test sessions for the test
			return StudentAnswer.objects.filter(test__id=test_id)
		return StudentAnswer.objects.none() # Path to endpoint : 'api/questions/tests/<int:test_id>/test-answers/'

class TestResultViewSet(viewsets.ReadOnlyModelViewSet):
	serializer_class = QuestionWithAnswerSerializer

	def get_queryset(self):
		test_session_id = self.kwargs.get('test_session_id')
		if test_session_id:
			test_session = get_object_or_404(StudentTestSession, pk=test_session_id)
			return Question.objects.filter(test=test_session.test)
		return Question.objects.none()

	def get_serializer_context(self):
		context = super(TestResultViewSet, self).get_serializer_context()
		context.update({
			"test_session_id": self.kwargs.get('test_session_id')
		})
		return context

#class TestResultBySubjectAndTermViewSet(viewsets.ModelViewSet):
#    queryset = StudentTestSession.objects.all()
#    serializer_class = StudentTestSessionSerializer
#    filter_backends = [filters.SearchFilter]
#    search_fields = ['test__subject__name', 'test__term__term']
#
    # Override get_queryset to filter by subject and term if they are passed as query parameters
#    def get_queryset(self):
#        queryset = super().get_queryset()
#        subject = self.request.query_params.get('subject')
#        term = self.request.query_params.get('term')
#        if subject:
#            queryset = queryset.filter(test__subject__name=subject)
#        if term:
#            queryset = queryset.filter(test__term__term=term)
#        queryset = queryset.annotate(average_marks=Avg('total_marks'))    
#        return queryset