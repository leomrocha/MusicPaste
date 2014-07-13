from django.shortcuts import render

# Create your views here.

def index(request):
 return render(request, 'musicapp/index.html')

def edit_score(request):
 return render(request, 'musicapp/edit_score.html')
