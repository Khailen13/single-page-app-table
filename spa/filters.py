import django_filters
from .models import TableRow


class TableRowFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="exact")  # равно
    name__icontains = django_filters.CharFilter(
        field_name="name", lookup_expr="icontains"
    )

    quantity = django_filters.NumberFilter()
    quantity__gt = django_filters.NumberFilter(field_name="quantity", lookup_expr="gt")
    quantity__lt = django_filters.NumberFilter(field_name="quantity", lookup_expr="lt")

    distance = django_filters.NumberFilter()
    distance__gt = django_filters.NumberFilter(field_name="distance", lookup_expr="gt")
    distance__lt = django_filters.NumberFilter(field_name="distance", lookup_expr="lt")

    date = django_filters.DateFilter()
    date__gt = django_filters.DateFilter(field_name="date", lookup_expr="gt")
    date__lt = django_filters.DateFilter(field_name="date", lookup_expr="lt")

    class Meta:
        model = TableRow
        fields = []
