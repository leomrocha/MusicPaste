from django import forms
from django.forms import ModelForm, Form
from musicapp.models import Sheet

from django.core.validators import validate_slug
from django.core.exceptions import ValidationError

################################################################################
#Custom validators
################################################################################
def vextab_validator(content):
    """
    For the moment only tries to avoid javascript injection
    #TODO Validates that the input contains valid vextab format
    """
    #TODO make a real VexTab validator format
    if content.find("'") >= 0 or content.find('"') >= 0 or content.find("javascript") >= 0:
        raise ValidationError("Vextab Invalid content detected")
    

################################################################################
#Forms
################################################################################

class SheetForm(ModelForm):
    title = forms.CharField(max_length=100, required=True, validators=[validate_slug])
    name = forms.CharField(max_length=100, required=True, validators=[validate_slug])
    email = forms.EmailField(max_length=254, required=True)
    #description = forms.CharField(max_length=512, required=False, validators=[validate_slug])  # TODO make it better to support punctuation symbols
    description = forms.CharField(max_length=512, required=False)
    content = forms.CharField(max_length=8192, required=True,
                                validators=[vextab_validator]) 
    class Meta:
        model = Sheet
