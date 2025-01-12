import random
from django.db.models import Case, When, Value, FloatField,DecimalField
from admins.models import *
from decimal import Decimal
import re

offerPhrases = [
    lambda percentage: f"Explore Our Selection: Up to {percentage}% Off on Handpicked PCB Boards!",
    lambda percentage: f"Limited Time Offer: Save Big with Up to {percentage}% Off on Select PCB Boards!",
    lambda percentage: f"Don't Miss Out: Get Up to {percentage}% Off on Premium PCB Boards Today!",
    lambda percentage: f"Upgrade Your Projects: Enjoy Up to {percentage}% Off on Selected PCB Boards!",
    lambda percentage: f"Shop Smart: Up to {percentage}% Off on High-Quality PCB Boards!"
]

bannerphrases = {
    "Explore The Latest Gadgets and Gizmos": "Stay ahead of the curve with our collection of cutting-edge electronics, ranging from smartphones to smart home devices.",
    "Discover The Future of Technology Today": "Experience innovation like never before with our range of futuristic gadgets and accessories designed to enhance your lifestyle.",
    "Unlock Your Tech Potential with Us": "Empower yourself with the latest advancements in technology. Our products are tailored to meet your tech needs and aspirations.",
    "Experience The Power of Cutting-Edge Electronics": "Harness the power of technology with our selection of state-of-the-art electronics, engineered for performance and reliability.",
    "Connect with The Best Deals in Electronics": "Find unbeatable deals on top-quality electronics. We offer competitive prices without compromising on quality or service.",
    "Find Your Perfect Tech Companion Here": "Discover your ideal tech companion from our diverse range of products. Whether for work or play, we have something for everyone.",
    "Get Ready to Upgrade Your Tech Game": "Level up your tech game with our comprehensive range of gadgets and accessories. Elevate your experience with us.",
    "Transform Your Home with Smart Electronics": "Turn your home into a smart sanctuary with our range of innovative smart electronics. Embrace convenience and efficiency.",
    "Shop The Best Electronics for Every Need": "From essential gadgets to specialized devices, we have the best electronics to cater to your every need and requirement.",
    "Elevate Your Lifestyle with Premium Electronics": "Indulge in luxury and sophistication with our premium selection of electronics. Elevate your lifestyle with elegance and style.",
}


defaultCategoryImage = "http://res.cloudinary.com/dg3m2vvvs/image/upload/v1710835028/vtsipjaola9uaeldow5b.jpg"
def getOfferPhrase(offer):
  random_phrase_function = random.choice(offerPhrases)
  offer_percentage = offer  # Example offer percentage, you can change this
  random_phrase = random_phrase_function(offer_percentage)
  return(random_phrase)

def getBannerPhrases():
  banner = random.choice(list(bannerphrases.keys()))
  return banner,bannerphrases[banner]


# it's filtering the queryset with given filters data such as offer ,category,brand and price
def apply_filters(queryset, filter_details):
    categories_filter = filter_details.get('categories', {})
    category_selected_ids = categories_filter.get('selected_ids', [])
    if categories_filter and category_selected_ids:
        queryset = queryset.filter(category__id__in=category_selected_ids)
    brand_filter = filter_details.get('brand', {})
    brand_selected_ids = brand_filter.get('selected_ids', [])
    if brand_filter and brand_selected_ids:
        queryset = queryset.filter(brand__id__in=brand_selected_ids)
    offer_filter = filter_details.get('offers', {})
    offer_selected_ids = offer_filter.get('selected_ids', [])
    if offer_filter and offer_selected_ids:
        queryset = queryset.filter(offer__id__in=offer_selected_ids)
    selected_price_range = filter_details.get('selectedPriceRange', [])
    if selected_price_range:
        min_price, max_price = selected_price_range
        queryset = queryset.filter(price__gte=min_price,price__lte=max_price)
    return queryset

# it's return suitable queryset with resptect to search_name
def get_filtered_queryset( search_name, filter_details):
        if not search_name:
            raise ValueError("Please provide a search name")
        if "offer-highlight" in search_name:
            offer_id = int(search_name.split(':')[1])
            queryset = Offer.objects.get(id=offer_id).products.all()
        elif 'all product' in search_name.lower():
            queryset = Product.objects.all()
        else:
            name_filtered_products = Product.objects.filter(name__icontains=search_name)
            tag_filtered_products = Product.objects.filter(tags__name__icontains=search_name)
            queryset = name_filtered_products | tag_filtered_products
        return apply_filters(queryset, filter_details)

# choosing suitable paginator page
def get_page_items( paginator, page_no):
    try:
        return paginator.page(page_no)
    except Exception:
        return paginator.page(1)

def get_filter_details(filter_details, queryset):
    main_categories_filter = get_categories_filter(filter_details, queryset)
    main_brands_filter = get_brands_filter(filter_details, queryset)
    main_offers_filter = get_offers_filter(filter_details, queryset)
    price_range = get_price_range(filter_details, queryset)
    selected_price_range = filter_details.get('selectedPriceRange', [])
    selected_price_range = selected_price_range if selected_price_range else price_range
    return {
        'categories': main_categories_filter,
        'brands': main_brands_filter,
        'priceRange': price_range,
        'selectedPriceRange': selected_price_range,
        'offers': main_offers_filter,
    }

def get_categories_filter(filter_details, queryset):
    categories_filter = filter_details.get('categories', {}).get('categories', {})
    if categories_filter:
        return filter_details['categories']
    else:
        new_categories_names = [(category_id, category_name) for category_id, category_name in queryset.values_list('category__id', 'category__category_name').distinct() if category_id is not None]
        categories_dict = [{'id': category[0], 'name': category[1]} for category in new_categories_names]
        return {
            'categories': categories_dict,
            'selected_ids': []
        }
    

def get_brands_filter( filter_details, queryset):
    brands_filter = filter_details.get('brands', {}).get('brands', {})
    if brands_filter:
        return filter_details['brands']
    else:
        new_brands_names = [(brand_id, brand_name) for brand_id, brand_name in queryset.values_list('brand__id', 'brand__name').distinct() if brand_id is not None]
        brands_dict = [{'id': brand[0], 'name': brand[1]} for brand in new_brands_names]
        return {
            'brands': brands_dict,
            'selected_ids': []
        }
def get_offers_filter( filter_details, queryset):
    offers_filter = filter_details.get('offers', {}).get('offers', {})
    if offers_filter:
        return filter_details['offers']
    else:
        new_offers_names = [(offer_id, f"{offer_discount}%" if offer_type =='percentage' else f"₹{offer_discount}") for offer_id, offer_discount, offer_type in queryset.values_list('offer__id', 'offer__discount', 'offer__discount_type').distinct() if offer_id is not None]
        offers_dict = [{'id': offer[0], 'name': offer[1]} for offer in new_offers_names]
        return {
            'offers': offers_dict,
            'selected_ids': []
        }

def get_price_range(filter_details, queryset):
    price_range = filter_details.get('priceRange', [])
    if price_range:
        return price_range
    else:
        prices = [product.price for product in queryset]
        max_price = 0
        if prices:
            max_price = Decimal(round((max(product.price for product in queryset) / Decimal(100)) + Decimal('0.5'))) * Decimal(100)
        min_price = 0
        return [min_price, max_price]

def get_response_data( products, paginator, filter_details,page_items):
    return {
        "products": products,
        "pagination": {
            "totalPages": paginator.num_pages,
            'currentPage': page_items.number,
        },
        "filter_details": filter_details,
    }

def custom_get_or_create(instance,created,models_add = {}):
    if not created:
        return 
    for name,model in models_add.items():
        setattr(instance, name, model.objects.create())
    instance.save()

def camel_to_snake(d):
    """
    Convert keys of a dictionary from camelCase to snake_case.
    """
    new_dict = {}
    for key, value in d.items():
        new_key = ''.join(['_' + c.lower() if c.isupper() else c for c in key]).lstrip('_')
        new_dict[new_key] = value
    return new_dict

def snake_to_camel(d):
    camelcase_data = {}
    for key, value in d.items():
        camelcase_key = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(key.split('_')))
        camelcase_data[camelcase_key] = value
    return camelcase_data

def camel_to_snake_key(name):
    """
    Convert camel case to snake case.
    """
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()