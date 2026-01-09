import django_filters
from .models import TableRow


class TableRowFilter(django_filters.FilterSet):

    class Meta:
        model = TableRow
        fields = {
            'name': ['exact', 'icontains'],
            'quantity': ['exact', 'gt', 'lt'],
            'distance': ['exact', 'gt', 'lt'],
            'date': ['exact', 'gt', 'lt']
        }
