from django.utils import timezone 
def formatDate(datetime,istoday):
  today = timezone.now().date()
  yesterday = today - timezone.timedelta(days=1)
  last_week = today - timezone.timedelta(days=7)
  # last_year = today - timezone.timedelta(days=365)
  date = datetime.date()
  formatted_date  = date
  if date == today:
      if istoday:
        formatted_date = 'Today'
      else:
        formatted_date = datetime.strftime('%I:%M %p')
  elif date == yesterday:
      formatted_date = 'Yesterday'
  elif date > last_week:
      formatted_date = datetime.strftime("%A")
  else:
      formatted_date = datetime.strftime('%y/%m/%d')
  return formatted_date
