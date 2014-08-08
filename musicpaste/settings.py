"""
Django settings for musicpaste project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""
###############################################################################
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

###############################################################################
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'wdi&tjhq6m*b7!e8$og1e%7njrop4dks6t%rbus+1ejc6x@9p8'

###############################################################################
#Server mode: Debug/Production
###############################################################################
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

###############################################################################
#Email configuration
###############################################################################
EMAIL_HOST = "mail.musicpaste.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "no-reply@musicpaste.com"
EMAIL_HOST_PASSWORD = "qM!6*Dvn"
EMAIL_USE_TLS = True

###############################################################################
# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'compressor',
    'musicapp',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'musicpaste.urls'

WSGI_APPLICATION = 'musicpaste.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

### HEROKU ###
# Parse database configuration from $DATABASE_URL
# Disabling this thing for now
#import dj_database_url
#DATABASES['default'] =  dj_database_url.config()

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# Static asset configuration
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    # other finders..
    'compressor.finders.CompressorFinder',
)


###############################################################################
#Django Compressor

#if not DEBUG:
COMPRESS_ENABLED = True
#COMPRESS_OFFLINE = True

COMPRESS_YUGLIFY_BINARY = 'yuglify' # assumes yuglify is in your path
COMPRESS_YUGLIFY_CSS_ARGUMENTS = '--terminal'
COMPRESS_YUGLIFY_JS_ARGUMENTS = '--terminal'
# New
COMPRESS_CSS_FILTERS = ['compressor.filters.css_default.CssAbsoluteFilter', 
                        'compressor.filters.yuglify.YUglifyCSSFilter']
# New
COMPRESS_JS_FILTERS = ['compressor.filters.yuglify.YUglifyJSFilter']
