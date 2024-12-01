from rest_framework import routers
from django.urls import path
from .viewsets import QuestionViewSet, TestViewSet, TestListViewSet, TestDetailViewSet, TestSessionViewSet, SubmitTestViewSet, SubmittedTestsViewSet, TestHistoryViewSet, TestResultsViewSet, TestAnswersViewSet,TestResultViewSet, StudentTestSessionViewSet #TestResultBySubjectAndTermViewSet
app_name = "questions"

router = routers.DefaultRouter()
router.register('questions', QuestionViewSet)
router.register('tests', TestViewSet, basename='tests')
router.register('testlist', TestListViewSet, basename='testlist')
router.register('testdetail', TestDetailViewSet, basename='testdetail')
router.register('testsessions', TestSessionViewSet, basename='testsession')
router.register('studenttestsession', StudentTestSessionViewSet, basename='studenttestsession')
router.register('submittest', SubmitTestViewSet, basename='submittest')
router.register('testhistory', TestHistoryViewSet, basename='testhistory')

#router.register(r'restresults', TestResultBySubjectAndTermViewSet, basename='restresults')



# Custom URL pattern for TestHistoryViewSet
test_history_urlpattern = [
    path('users/<int:user_id>/test-history/', TestHistoryViewSet.as_view({'get': 'list'}), name='user-test-history')
]

test_results_urlpattern = [
    path('tests/<int:test_id>/test-results/', TestResultsViewSet.as_view({'get': 'list'}), name='test-test-results')
]

test_answers_urlpattern = [
    path('tests/<int:test_id>/test-answers/', TestAnswersViewSet.as_view({'get': 'list'}), name='test-test-answers')
]

test_result_urlpattern = [
    path('test-sessions/<int:test_session_id>/test-result/', TestResultViewSet.as_view({'get': 'list'}), name='test-test-result')
]
