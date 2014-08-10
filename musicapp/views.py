from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
#shortcuts
from django.shortcuts import get_object_or_404
#email
from django.core.mail import send_mail
#templates
from django.template import loader, Context

#
from django.views.decorators.clickjacking import xframe_options_exempt

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
        print "dir(form): ", dir(form)
        print "form: ", form.fields
        if form.is_valid(): # All validation rules pass
            new_sheet = form.save()
            #print "new sheet = ", new_sheet
            # links to see the results (embed and display)
            subject = "Hi %s! Here your newly created music sheets", new_sheet.name
            embed_link = request.build_absolute_uri(reverse('embed_score', args=[new_sheet.suuid]))
            display_link = request.build_absolute_uri(reverse('display_score', args=[new_sheet.suuid]))
            #print "links: "
            #print embed_link
            #print display_link
            #editlink = "editlink"
            #TODO build email
            email_context = {"subject": subject,
                             "name": new_sheet.name,
                             "title": new_sheet.title,
                             "embed_link": embed_link,
                             "display_link": display_link,
                             }
            t = loader.get_template('simple_basic.email')
            c = Context(email_context)
            rendered = t.render(c)
            print "sending email"
            # TODO Send email to user
            #Redirect if everything went great
            return HttpResponseRedirect(reverse('thanks')) # Redirect after POST
        else:
            print "The form is not valid"
            print form.errors
            print "is not valid because ... ?"
            #reload the page but with the elements given already pre-filled 
            #and a warning telling about the errors
            #TODO modify the template to take in account the given post data
            return render(request, 'musicapp/edit_score.html', {
                'form': form,
            })
    else:
        return render(request, 'musicapp/edit_score.html')

    


def display_score(request,score_id):
    """
    """
    context = {}
    #find the score by the given input score_id, redirect to 404 if not found
    sheet = get_object_or_404(Sheet, suuid=score_id)
    context["sheet"] = sheet
    return render(request, 'musicapp/display_score.html', context)
        
@xframe_options_exempt
def embed_score(request, score_id):
    """
    """
    context = {}
    #find the score by the given input score_id, redirect to 404 if not found
    sheet = get_object_or_404(Sheet, suuid=score_id)
    context["sheet"] = sheet
    return render(request, 'musicapp/embed_score.html', context)

################################################################################
#
################################################################################

def thanks(request):
    """
    """
    return render(request, 'musicapp/thanks.html')
