from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from .models import Product,Category
from .serializers import ProductSerializer,CategorySerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_products(request):
  products=Product.objects.all()
  serializer=ProductSerializer(products,many=True)
  return Response(serializer.data)


@api_view(['GET'])
def get_categories(request):
  category=Category.objects.all()
  serializer=CategorySerializer(category,many=True)
  return Response(serializer.data)
