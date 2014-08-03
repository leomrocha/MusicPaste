from django.db import models

# Create your models here.

class Sheet(models.Model):
    title = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    description = models.TextField() #TODO add validation
    content = models.TextField()
