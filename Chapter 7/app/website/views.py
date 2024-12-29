from django.shortcuts import render 
# from .forms import SearchForm, CommentForm 
from .models import Post, Comment  
from .actions import POST_PER_PAGE 

def all_posts(request):
	return render(
		request,
		"base.html",
		{
			"posts": Post.objects.all()[:5],
			"page": "pages/all_posts.html",
			"active_nav": "all_posts",
			"next_page": 2,
			"is_last_page": (Post.objects.count() // POST_PER_PAGE) == 2
		}
		)

# def single_post(request):
# 	pass 

# def about(request):
# 	pass 

