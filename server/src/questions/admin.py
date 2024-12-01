from django.contrib import admin
from django import forms
from django.db import models
from datetime import timedelta
from django.utils.safestring import mark_safe
from django.forms import ModelForm, CheckboxInput
import nested_admin
from .models import Question, Choice, Test, StudentTestSession, StudentAnswer
from .forms import QuestionForm


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4

class QuestionForm(ModelForm):
    class Meta:
        model = Question
        fields = '__all__'
        widgets = {
            'correct_answer': CheckboxInput(attrs={'class': 'true-false-toggle'}),
        }

class QuestionAdmin(admin.ModelAdmin):
    form = QuestionForm
    list_display = ['id', 'image', 'video', 'content', 'author', 'marks', 'date_created']
    readonly_fields = ['id']
    inlines = [ChoiceInline]

    class Media:
        js = ('questions/js/question_toggle.js',)

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in ['image', 'video']:
            kwargs['widget'] = forms.ClearableFileInput()
        return super().formfield_for_dbfield(db_field, request, **kwargs)    

    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj, change, **kwargs)
        # Set 'id' field read-only if this is a change form (i.e., obj is not None)
        if obj:
            self.readonly_fields = ['id',]
            # Check if the question type is 'FB' and pretty-print its JSON data
            if obj.question_type == 'FB':
                form.base_fields['fill_in_the_blanks_data'].initial = json.dumps(obj.fill_in_the_blanks_data, indent=4)
        return form


    def get_readonly_fields(self, request, obj=None):
        if obj:  # This is the change view
            return ['id',] + list(self.readonly_fields)
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        # This line ensures that the clean method of the model is called
        obj.full_clean()
        # If it's a true/false question and the toggle is active, set correct_answer
        if obj.question_type == 'TF':
            obj.correct_answer = form.cleaned_data.get('correct_answer')
        else:
            obj.correct_answer = None  # Clear the value for non-true/false questions
        super().save_model(request, obj, form, change)

    def get_inline_instances(self, request, obj=None):
        # Only show ChoiceInline for MCQ type questions
        if obj is None or obj.question_type == 'MCQ':
            self.inlines = [ChoiceInline]
        else:
            self.inlines = []
        return super().get_inline_instances(request, obj)   

admin.site.register(Question, QuestionAdmin)


class ChoiceInline(nested_admin.NestedTabularInline):
    model = Choice

    def get_extra(self, request, obj=None, **kwargs):
        if obj:  # obj is not None, so this is a change view
            return 4
        return 0


class QuestionInline(nested_admin.NestedTabularInline):
    model = Question
    inlines = [ChoiceInline]  # Nested inlines for choices under each question
    exclude = ('author',)
    formfield_overrides = {
        models.CharField: {'widget': forms.HiddenInput()},  # Hide the question_type field by default
    }

    # Specify custom JavaScript to handle the toggle behavior
    class Media:
        js = ('questions/js/toggle_explanation.js',)

    def get_extra(self, request, obj=None, **kwargs):
        if obj:  # obj is not None, so this is a change view
            return 0
        return 1

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        if obj and obj.test_type != 'MX':
            # Directly manipulate base_fields as a dictionary
            if 'question_type' in formset.form.base_fields:
                del formset.form.base_fields['question_type']
        return formset
    

class TestAdmin(nested_admin.NestedModelAdmin):
    list_display = ['id', 'title', 'course', 'author', 'test_type', 'max_time', 'start_time', 'end_time', 'date_created']
    readonly_fields = ('id',)  # Make 'id' read-only
    inlines = [QuestionInline]   

    class Media:
        js = ('questions/js/test_type_handler.js',)


    def get_readonly_fields(self, request, obj=None):
        if obj:  # This is the change view
            return self.readonly_fields + ('id',)
        return self.readonly_fields

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Check if the db_field is 'author' and if the model is 'Question'
        if db_field.name == 'author' and db_field.model == Question:
            # Set the default value to the logged in user
            kwargs["initial"] = request.user.id
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_formset(self, request, form, formset, change):
        if formset.model == Question:
            instances = formset.save(commit=False)
            for instance in instances:
                # Set the author of the question to the author of the test
                instance.author = form.instance.author

                # Set question_type based on the test_type, except when it's mixed
                if form.instance.test_type != 'MX':
                    instance.question_type = form.instance.test_type

                instance.save()
            formset.save_m2m()  # Save many-to-many fields if needed
        else:
            # Call the parent class's save_formset if it's not a Question formset
            super().save_formset(request, form, formset, change)

admin.site.register(Test, TestAdmin)


@admin.register(StudentTestSession)
class StudentTestSessionAdmin(admin.ModelAdmin):
    list_display = ['id','student', 'test', 'start_time', 'end_time', 'total_marks', 'was_submitted_on_time']
    readonly_fields = ['id','student', 'test', 'start_time', 'total_marks', 'end_time']

    def was_submitted_on_time(self, obj):
        # If the test session has no end time, we can't determine if it was submitted on time
        if obj.end_time is None:
            return None  # You might want to return False or some other indicator here

        # Calculate the expected end time based on the start time and max_time allowed for the test
        expected_end_time = obj.start_time + timedelta(minutes=obj.test.max_time)
        
        # Check if the test was submitted before the expected end time
        return obj.end_time <= expected_end_time
    was_submitted_on_time.boolean = True
    was_submitted_on_time.short_description = 'Submitted On Time?'
    was_submitted_on_time.allow_tags = True


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ['student', 'question', 'selected_choice', 'test', 'test_session']
    
