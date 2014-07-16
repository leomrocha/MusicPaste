from django.shortcuts import render
from django.http import HttpResponseRedirect
from musicapp.forms import SheetForm
from django.core.urlresolvers import reverse

# Create your views here.

def index(request):
    return render(request, 'musicapp/index.html')

def edit_score(request):
    if request.method == 'POST': # If the form has been submitted...
        form = SheetForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            # Process the data in form.cleaned_data
            # ...
            form.save()
            return HttpResponseRedirect(reverse('thanks')) # Redirect after POST
    else:
        return render(request, 'musicapp/edit_score.html')

    return render(request, 'musicapp/edit_score.html', {
        'form': form,
    })

def thanks(request):
    return render(request, 'musicapp/thanks.html')
