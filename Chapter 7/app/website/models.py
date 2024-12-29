from django.db import models
from django.utils.text import slugify 
from django.urls import reverse 


class Post(models.Model):
    # Field: Title of the article, name of the author, content of the article and date of creation.
    title = models.CharField(max_length=200, unique=True)
    author = models.CharField(max_length=20)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    @property 
    def slug(self):
        return slugify(self.title)

    @property
    def summary(self):
        return self.content[:100] + "..."

    @property
    def get_absolute_url(self):
        return reverse("single post", kwargs={"slug": self.slug})

    def __str__(self):
        return self.title 


class Comment(models.Model):
    # Fields: Name of the author, content of the comment, relation to the article and date of creation.
    author = models.CharField(max_length=20)
    content = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name 

