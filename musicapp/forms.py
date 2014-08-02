from django import forms
from django.forms import ModelForm, Form
from musicapp.models import Sheet

class SheetForm(ModelForm):
    title = forms.CharField(max_length=100, required=True)
    name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(max_length=254, required=True)
    description = forms.CharField(required=False)
    content = forms.CharField(required=True)
    class Meta:
        model = Sheet
