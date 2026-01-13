from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet

from spa.filters import CaseInsensitiveOrderingFilter, TableRowFilter
from spa.models import TableRow
from spa.pagination import TableRowPagination
from spa.serializers import TableRowSerializer


class TableRowViewSet(ModelViewSet):
    queryset = TableRow.objects.all()
    serializer_class = TableRowSerializer
    filter_backends = [DjangoFilterBackend, CaseInsensitiveOrderingFilter]
    ordering = ["-date", "name"]
    ordering_fields = ["name", "quantity", "distance"]
    filterset_class = TableRowFilter
    pagination_class = TableRowPagination
    basename = "table"
