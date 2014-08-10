from django.contrib import admin
from musicapp.models import *


class SheetAdmin(admin.ModelAdmin):
    """
    Allow view of non modifiable field in the 
    """
    readonly_fields=('suuid',)
    
# Register your models here.

admin.site.register(Sheet, SheetAdmin)


