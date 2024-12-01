from django import forms
from django.core.exceptions import ValidationError
from .models import Question
import json

class QuestionForm(forms.ModelForm):
    fill_in_the_blanks_data = forms.CharField(
        widget=forms.Textarea(attrs={'cols': 80, 'rows': 20}),
        required=False,
        help_text="Enter the details for the fill in the blanks data in JSON format."
    )

    class Meta:
        model = Question
        fields = '__all__'

    def clean_fill_in_the_blanks_data(self):
        data = self.cleaned_data.get('fill_in_the_blanks_data', '')
        try:
            # Parse the JSON to ensure it's valid
            json_data = json.loads(data)
        except json.JSONDecodeError as e:
            raise ValidationError(f"Invalid JSON: {e}")
        return json_data

    def save(self, commit=True):
        # Convert the JSON data back to a dictionary before saving
        instance = super().save(commit=False)
        fill_in_the_blanks_data = self.cleaned_data['fill_in_the_blanks_data']
        instance.fill_in_the_blanks_data = json.loads(fill_in_the_blanks_data)
        if commit:
            instance.save()
            self.save_m2m()
        return instance

