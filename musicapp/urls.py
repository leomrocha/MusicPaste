from django.conf.urls import patterns, url

from musicapp import views

urlpatterns = patterns('',
    url(r'^thanks/$', views.thanks, name='thanks'),
    url(r'^edit_score/$', views.edit_score, name='edit_score'),
    url(r'^display_score/(?P<score_id>\w+)/$', views.display_score, name='display_score'),
    url(r'^embed_score/(?P<score_id>\w+)/$', views.embed_score, name='embed_score'),
    url(r'^edit_fretboard/$', views.edit_fretboard, name='edit_fretboard'),
    url(r'^display_fretboard/(?P<score_id>\w+)/$', views.display_fretboard, name='display_fretboard'),
    url(r'^embed_fretboard/(?P<score_id>\w+)/$', views.embed_fretboard, name='embed_fretboard'),
    url(r'^$', views.index, name='index'),
)
