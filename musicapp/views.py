from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
#shortcuts
from django.shortcuts import get_object_or_404
#email
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
#templates
from django.template import loader, Context

#
from django.views.decorators.clickjacking import xframe_options_exempt

#forms
from musicapp.forms import SheetForm
#models
from musicapp.models import Sheet

import sys

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
            new_sheet = form.save()
            #print "new sheet = ", new_sheet
            # links to see the results (embed and display)
            subject = "Hi %s! Here your newly created music sheets" % new_sheet.name
            embed_link = request.build_absolute_uri(reverse('embed_score', args=[new_sheet.suuid]))
            display_link = request.build_absolute_uri(reverse('display_score', args=[new_sheet.suuid]))
            #build email
            email_context = {"subject": subject,
                             "name": new_sheet.name,
                             "title": new_sheet.title,
                             "embed_link": embed_link,
                             "display_link": display_link,
                             }
            htmly = loader.get_template('simple_basic_inlined.email')
            plaintext = loader.get_template('simple_basic.txt')
            c = Context(email_context)
            print "sending email"
            sys.stdout.flush()
            try:
                from_email = 'MusicPaste - Link Service <no-reply@musicpaste.com>'
                text_content = plaintext.render(c)
                html_content = htmly.render(c)
                msg = EmailMultiAlternatives(subject, text_content, from_email, [new_sheet.email])
                msg.attach_alternative(html_content, "text/html")
                msg.send()
                print "email sent"
                sys.stdout.flush()
            except Exception as e:
                print "ERROR sending email: ", e
                sys.stdout.flush()
            #TODO redirect to page error
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
