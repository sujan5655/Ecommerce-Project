from django.shortcuts import render
from rest_framework import status
# Create your views here.
from rest_framework.response import Response
from .models import Product,Category,Cart,CartItem
from .serializers import ProductSerializer,CategorySerializer,CartItemSerializer,CartSerializer
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Order,OrderItem
from .serializers import RegisterSerializer,UserSerializer
@api_view(['GET'])
def get_products(request):
  products=Product.objects.all()
  serializer=ProductSerializer(products,many=True)
  return Response(serializer.data)

@api_view(['GET'])
def get_product(request,pk):
  try:
    product=Product.objects.get(id=pk)
    serializer=ProductSerializer(product,context={'request':request})
    return Response(serializer.data)
  except Product.DoesNotExist:
    return Response({'error':"product not found"},status=404)


@api_view(['GET'])
def get_categories(request):
  category=Category.objects.all()
  serializer=CategorySerializer(category,many=True)
  return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
  cart,created=Cart.objects.get_or_create(user=request.user)
  serializer=CartSerializer(cart)
  return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
  product_id=request.data.get('product_id')
  product=Product.objects.get(id=product_id)
  cart,created=Cart.objects.get_or_create(user=request.user)
  item,created=CartItem.objects.get_or_create(cart=cart,product=product)
  if not created:
    item.quantity+=1
    item.save()
  return Response({'message':'Product added to cart',"cart":CartSerializer(cart).data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
  item_id=request.data.get('item_id')
  CartItem.objects.filter(id=item_id).delete()
  return Response({'message':"Item removed from Cart"})


# @api_view(['POST'])
# def update_cart_quantity(request):
#   item_id=request.data.get('item_id')
#   quantity=request.data.get('quantity')
#   if not item_id or quantity is None:
#     return Response({'error':'Item id and quantity are required'},status=400)
#   try:
#     item=CartItem.objects.get(id=item_id)
#     if int(quantity)<1:
#       item.delete()
#       return Response({'error':"Quantity must be at least 1"},status=400)
#     item.quantity=quantity
#     item.save()
#     serializer=CartItemSerializer(item)
#     return Response(serializer.data)
#   except CartItem.DoesNotExist:
#     return Response({'error':'Cart Item not found'},status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if item_id is None or quantity is None:
        return Response(
            {'error': 'Item id and quantity are required'},
            status=400
        )

    try:
        quantity = int(quantity)
        item = CartItem.objects.get(id=item_id)

        if quantity < 1:
            item.delete()
            return Response(
                {'message': 'Item removed from cart'},
                status=200
            )

        item.quantity = quantity
        item.save(update_fields=['quantity'])

        serializer = CartItemSerializer(item)
        return Response(serializer.data)

    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Cart item not found'},
            status=404
        )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Quantity must be a valid integer'},
            status=400
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        # Get data sent from React
        data = request.data

        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')

        # validate phone number
        if not phone.isdigit() or len(phone)<10:
           return Response({'error':'Invalid phone number'},status=400)
        # Get user's cart
        cart,created=Cart.objects.get_or_create(user=request.user)

        if not cart or not cart.items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=400
            )

        # cart_items = list(cart.items.select_related('product').all())

        # Calculate total
        total = sum([
            float(item.product.price) * item.quantity
            for item in cart.items.all()]
        )

        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=total
        )

        # Create all order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear cart after creating every order item
        cart.items.all().delete()

        return Response({
            'message': 'Order placed successfully',
            'order_id': order.id,
            'total_amount': total
        }, status=201)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )



@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        user_serializer = UserSerializer(user)

        return Response(
            {
                "message": "User created successfully",
                "user": user_serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

