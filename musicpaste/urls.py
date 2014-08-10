from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'musicpaste.views.index', name='index'),
    url(r'^$', include('musicapp.urls')),
    # url(r'^blog/', include('blog.urls')),

    url(r'^musicapp/', include('musicapp.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
