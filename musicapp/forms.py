from django.forms import ModelForm
from musicapp.models import Sheet

class SheetForm(ModelForm):
    class Meta:
        model = Sheet
        fields = ['title', 'name', 'email', 'description', 'content']
