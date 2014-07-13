from django.conf.urls import patterns, url

from musicapp import views

urlpatterns = patterns('',
    url(r'^edit_score/$', views.edit_score, name='edit_score'),
    url(r'^$', views.index, name='index'),
)
