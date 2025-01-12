from django.db.models import Sum, Count,Case,When,F,Value,FloatField,DecimalField,IntegerField
from django.db.models.functions import Round
from django.utils.timezone import now, timedelta
from django.db.models.functions import TruncDay
from admins.models import *
from django.utils.timezone import now, timedelta
def toCamelCase(data):
  camelcase_data = {}
  for key, value in data.items():
      camelcase_key = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(key.split('_')))
      camelcase_data[camelcase_key] = value
  return camelcase_data

def calculate_percentage_change(old_value, new_value):
    print(old_value,new_value)
    if old_value == 0:
        if new_value == 0:
            return 0  
        else:
            return 100 
    # Calculate the difference between the new and old values
    difference = new_value - old_value
    
    # Calculate the percentage change
    percentage_change = (difference / old_value) * 100
    
    return int(percentage_change)
def salesOverView(date=None,is_second=False):
  
  if date  and date.get('start_date') and date.get('end_date'):
    global difference_in_days,start_date
    start_date = datetime.datetime.strptime((date.get('start_date')), "%Y-%m-%d")
    end_date = datetime.datetime.strptime(date.get('end_date'), "%Y-%m-%d")
    days_difference = (end_date - start_date).days
    queryset = Order.objects.filter(_order_at__gte=start_date,_order_at__lte=end_date)
  else:
    queryset = Order.objects.all()
  refund_conition = When(status___refunded_date__isnull=False,then = F('total'))
  orders_condition  = When(is_return_order=False,then=Value(1))

  all_time_sales_overview = queryset.aggregate(
          gross_sales=Sum('profit',default=Value(0),output_field=DecimalField(max_digits=10, decimal_places=2)),
          shipping=Sum('delivery_details__delivery_charge', output_field=DecimalField(max_digits=10, decimal_places=2)),
          net_sales=Sum('profit',default=Value(0),output_field=DecimalField(max_digits=10, decimal_places=2)),
          discounts=Sum('discount', output_field=DecimalField(max_digits=10, decimal_places=2)),
          refunds=(Sum(Case(refund_conition, default=Value(0),output_field=DecimalField(max_digits=10, decimal_places=2)))),
          orders = (Sum(Case(orders_condition,default=Value(0),output_field=IntegerField()))),
          )
  all_time_sales_overview_others = User.objects.aggregate(total_customer = Count('email'))
  return_data = {
    'total_customers':{"value":round(all_time_sales_overview_others['total_customer'] or 0,2)},
    'gross_sales':{"value":round(all_time_sales_overview['gross_sales'] or 0,2)},
    'net_sales':{"value":round(all_time_sales_overview['net_sales'] or 0,2)},
    'discounts':{"value":round(all_time_sales_overview['discounts'] or 0,2)},
    'refunds':{"value":round(all_time_sales_overview['refunds'] or 0,2)},
    'shipping':{"value":round(all_time_sales_overview['shipping'] or 0,2)},
    'orders':{"value":round(all_time_sales_overview['orders'] or 0,2)},
    }
  if date and not is_second:
    new_end_date = start_date - timedelta(days=1)
    new_start_date = new_end_date - timedelta(days=days_difference)
    old_sales_overview_data = salesOverView(date={'start_date':new_start_date.strftime("%Y-%m-%d"),
        'end_date':new_end_date.strftime("%Y-%m-%d")},is_second=True)
    updated_return_data = {}
    for key, value in old_sales_overview_data.items():
        new_value = return_data[key]['value'] or 0
        old_value = value['value']
        growth_rate = calculate_percentage_change(old_value=old_value, new_value=new_value)
        type = 'neutral'
        if growth_rate>0:
          type='up'
        elif growth_rate<0:
          growth_rate = growth_rate*-1
          type='down'
        updated_return_data[key] = {'value': new_value, 'growth_rate': growth_rate,'type':type}
    return_data = updated_return_data
  return return_data 
def toLabelData(dic):
  label = [ key for key,value in dic.items()]
  data = [ value for key,value in dic.items()]
  return {'labels':label,'data':data}


def toFulldayFormat(last_date,data,value_key):


  if last_date is None or data is None:
    return  {
    'labels':[],
    'data':[]
  }
  dic = {item['day']: item[value_key] for item in data}
  temp_date = last_date
  day_after = datetime.datetime.today() + timedelta(days=1)
  res = {
    'labels':[],
    'data':[]
  }
  while temp_date.date()!=day_after.date():
    day = temp_date.day
    res['labels'].append(day)
    res['data'].append(round(dic.get(day,0),2 ))
    temp_date = temp_date + timedelta(days=1)
  return res
order_status = [
  '_request_received_date', '_request_confirmed_date',
  '_refunded_date', '_resolved_date','_replacement_date','_product_received_date','_received_date', '_confirmed_date', '_shipped_date', '_completed_date','_cancelled_date'
]
return_order_status = [ '_request_received_date', '_request_confirmed_date',
  '_refunded_date', '_resolved_date','_replacement_date','_product_received_date',]
status_hide_input = {}
status_read_only_input = {}
status_read_only_input['_cancelled_date'] = order_status
select_status = {}

for i in range(len(order_status)):
    current_status = order_status[i]
    next_index = i + 1
    status_read_only_input[current_status] = order_status[:next_index]
    status_hide_input[current_status] = order_status[next_index+1:-1]
STATUS_CHOICES = (
        ('request_received', 'Return Request Received'),
        ('request_confirmed', 'Return Request Confirmed'),
        ('refunded', 'Refunded'),
        ('resolved', 'Return Resolved'),
        ('replacement', 'Replacement'),
        ('product_received', 'Return Product Received'),
        ('received', 'Received'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

def get_ready_only_fields(status,is_return_order,obj):
  get_status = f'_{status}_date'
  temp_read_only = status_read_only_input.get(get_status,[])
  read_only_fields = set(temp_read_only)
  if not is_return_order:
      read_only_fields = set(temp_read_only) - set(return_order_status) 
  if is_return_order:
      if '_received_date' in read_only_fields:
        read_only_fields.remove('_received_date')
      if '_confirmed_date' in read_only_fields:
        read_only_fields.remove('_confirmed_date')
  if obj and getattr(obj,'_replacement_date') is not None:
      read_only_fields.remove('_resolved_date')
      read_only_fields.remove('_refunded_date')
  if obj and getattr(obj,'_resolved_date') is not None:
    read_only_fields.remove('_refunded_date')
  return read_only_fields if read_only_fields else set([])

def get_hide_inputs(status,is_return_order,obj):
    hide_inputs = set(order_status) -  set(get_ready_only_fields(status,is_return_order,obj))
    return hide_inputs
def get_status_select_values(st):
    idx = -1
    for i, (status, _) in enumerate(STATUS_CHOICES):
        if status == st:
          idx = i
          break
    if status == 'request_confirmed':
      return [
        ('request_confirmed', 'Return Request Confirmed'),
        ('replacement', 'Replacement'),
        ('refunded', 'Refunded'),
        ('resolved', 'Return Resolved'),STATUS_CHOICES[-1]]
    if status == 'refunded':
      return [('refunded', 'Refunded')]
    if status == 'resolved':
      return [('resolved', 'Return Resolved')]
    if status == 'product_received':
      return [('product_received', 'Return Product Received'),('shipped', 'Shipped'),('refunded', 'Refunded'),]
    if status == 'product_received':
      return [('product_received', 'Return Product Received'),('shipped', 'Shipped'),STATUS_CHOICES[-1]]
    if status == 'shipped':
      return [ ('shipped', 'Shipped'),('completed', 'Completed'),]
    if idx == len(STATUS_CHOICES)-2:  
      return [STATUS_CHOICES[idx]]
    elif idx == len(STATUS_CHOICES)-1:
      return [STATUS_CHOICES[idx]]
    elif idx < len(STATUS_CHOICES)-2:
      return [STATUS_CHOICES[idx],STATUS_CHOICES[idx+1],STATUS_CHOICES[-1]]
    
def pop_item_from_list(list,target):
  for i,item in enumerate(list):
    if item==target:
        list.pop(i)
        return list
  return list





def get_order_control_data():
  admin_order_control = AdminOrderControl.objects.first()
  if admin_order_control:
    return admin_order_control.return_days,admin_order_control.lazy_confirmation_cancel_days
  else:
    return 7,5

def all_fields_readOnly(obj):
    return [field.name for field in obj._meta.fields]

# def get