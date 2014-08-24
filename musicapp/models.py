from django.db import models

#unique ID
#TODO find why this module is failing ALL the time
#import shortuuid
#For the moment use normal uuid and see
import uuid

# Create your models here.

class Sheet(models.Model):
    """
    """
    #suuid = models.CharField(max_length=64, default=shortuuid.ShortUUID().random(length=22), editable=False) #TODO fix the bug in shortuuid library
    #suuid = models.CharField(max_length=64, default=shortuuid.uuid(name="musicpaste.com"), editable=False) #NOP, this one worked WORST, EVERY single instance is equal
    suuid = models.CharField(max_length=64, default=uuid.uuid4().replace('-',''), editable=False) #Let's try with traditional uuid and see
    title = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    description = models.TextField(max_length=512)
    content = models.TextField(max_length=8192)

