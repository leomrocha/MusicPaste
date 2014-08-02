from django.conf.urls import patterns, url

from musicapp import views

urlpatterns = patterns('',
    url(r'^thanks/$', views.thanks, name='thanks'),
    url(r'^edit_score/$', views.edit_score, name='edit_score'),
    url(r'^view_score/$', views.edit_score, name='view_score'),
    url(r'^embed_score/$', views.edit_score, name='embed_score'),
    url(r'^$', views.index, name='index'),
)
