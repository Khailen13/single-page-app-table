from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter

from spa.filters import TableRowFilter, CaseInsensitiveOrderingFilter
from spa.models import TableRow
from spa.serializers import TableRowSerializer
from spa.pagination import TableRowPagination


class TableRowViewSet(ModelViewSet):
    queryset = TableRow.objects.all()
    serializer_class = TableRowSerializer
    filter_backends = [DjangoFilterBackend, CaseInsensitiveOrderingFilter]
    ordering = ["-date", "name"]
    ordering_fields = ["name", "quantity", "distance"]
    filterset_class = TableRowFilter
    pagination_class = TableRowPagination
    basename = "table"
