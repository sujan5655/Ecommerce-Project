from django.contrib import admin
from .models import Category,Product,Order,OrderItem,UserProfile,CartItem,Cart
# Register your models here.
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(UserProfile)
admin.site.register(Cart)
admin.site.register(CartItem)