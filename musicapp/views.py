from django.shortcuts import render
from django.http import HttpResponseRedirect
from musicapp.forms import SheetForm
from django.core.urlresolvers import reverse

#email
from django.core.mail import send_mail

# Create your views here.

def index(request):
    return render(request, 'musicapp/index.html')

def edit_score(request):
    if request.method == 'POST': # If the form has been submitted...
        form = SheetForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            form.save()
            # TODO recover id an dlink to actually see the results (embed, edit and view)
            embedlink = "embedlink"
            viewlink = "viewlink"
            editlink = "editlink"
            # TODO Send email to user
            

            return HttpResponseRedirect(reverse('thanks')) # Redirect after POST
    else:
        return render(request, 'musicapp/edit_score.html')

    return render(request, 'musicapp/edit_score.html', {
        'form': form,
    })

def thanks(request):
    return render(request, 'musicapp/thanks.html')
