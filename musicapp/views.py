from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
#shortcuts
from django.shortcuts import get_object_or_404
#email
from django.core.mail import send_mail

#forms
from musicapp.forms import SheetForm
#models
from musicapp.models import Sheet

#INDEX
def index(request):
    """
    """
    return render(request, 'musicapp/index.html')

################################################################################
#scores
################################################################################

def edit_score(request):
    """
    """
    if request.method == 'POST': # If the form has been submitted...
        form = SheetForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            #TODO add data validationprint "Saving score: ", form
            form.save()
            # TODO recover id an dlink to actually see the results (embed, edit and display)
            #embedlink = "embedlink"
            #displaylink = "displaylink"
            #editlink = "editlink"
            # TODO Send email to user
            

            return HttpResponseRedirect(reverse('thanks')) # Redirect after POST
    else:
        return render(request, 'musicapp/edit_score.html')

    return render(request, 'musicapp/edit_score.html', {
        'form': form,
    })


def display_score(request,score_id):
    """
    """
    context = {}
    #find the score by the given input score_id, redirect to 404 if not found
    sheet = get_object_or_404(Sheet, id=score_id)
    context["sheet"] = sheet
    return render(request, 'musicapp/display_score.html', context)
        

def embed_score(request, score_id):
    """
    """
    context = {}
    #find the score by the given input score_id, redirect to 404 if not found
    sheet = get_object_or_404(Sheet, id=score_id)
    context["sheet"] = sheet
    return render(request, 'musicapp/embed_score.html', context)

################################################################################
#
################################################################################

def thanks(request):
    """
    """
    return render(request, 'musicapp/thanks.html')
