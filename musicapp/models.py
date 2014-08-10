from django.db import models

#unique ID
import shortuuid

# Create your models here.

class Sheet(models.Model):
    """
    """
    suuid = models.CharField(max_length=64, default=shortuuid.ShortUUID().random(length=22), editable=False)
    title = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    description = models.TextField(max_length=512)
    content = models.TextField(max_length=8192)

