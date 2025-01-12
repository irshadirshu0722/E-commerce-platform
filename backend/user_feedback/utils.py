import traceback
from admins.models import *

def update_order_feedback(feedbacks):
    for feedback in feedbacks:
        feedback_id = feedback.get('id')
        rating = feedback.get('star_rating')
        print(feedback_id,rating)
        if feedback_id is None or rating is None:  
            continue 
        try:
            instance,created = ProductFeedback.objects.get_or_create(id=feedback_id)
        except ProductFeedback.DoesNotExist:
            traceback.print_exc()
            continue  # Skip to the next feedback if instance not found
        old_star = instance.star_rating
        instance.star_rating = rating
        instance.save()
        product = Product.objects.get(id=feedback.get('product'))
        if product:
            update_product_rating(old_star,instance.star_rating,product)
    return "Done"

def update_product_rating(old_star,new_star,product):
    if not product or old_star == new_star:
        return
    product_rating, created = ProductRating.objects.get_or_create(product=product)
    if old_star != new_star:
        if old_star == 1:
            product_rating.one_star -= 1
        elif old_star == 2:
            product_rating.two_star -= 1
        elif old_star == 3:
            product_rating.three_star -= 1
        elif old_star == 4:
            product_rating.four_star -= 1
        elif old_star == 5:
            product_rating.five_star -= 1
    if new_star == 1:
        product_rating.one_star += 1
    elif new_star == 2:
        product_rating.two_star += 1
    elif new_star == 3:
        product_rating.three_star += 1
    elif new_star == 4:
        product_rating.four_star += 1
    elif new_star == 5:
        product_rating.five_star += 1
    total_ratings = product_rating.one_star + product_rating.two_star + product_rating.three_star + product_rating.four_star + product_rating.five_star
    if total_ratings > 0:
      product_rating.one_star_percentage = int((product_rating.one_star / total_ratings) * 100)
      product_rating.two_star_percentage = int((product_rating.two_star / total_ratings) * 100)
      product_rating.three_star_percentage = int((product_rating.three_star / total_ratings) * 100)
      product_rating.four_star_percentage = int((product_rating.four_star / total_ratings) * 100)
      product_rating.five_star_percentage = int((product_rating.five_star / total_ratings) * 100)
    
    product_rating.save()
