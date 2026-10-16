
from django.contrib import admin
from django.urls import path,include
from . import views
urlpatterns = [
    path('products/',views.get_products),
    path('categories/',views.get_categories)

]
