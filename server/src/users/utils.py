from django.utils import timezone
from .models import Term

def get_current_term():
    today = timezone.now().date()
    try:
        current_term = Term.objects.get(start_date__lte=today, end_date__gte=today)
        return current_term
    except Term.DoesNotExist:
        return None
