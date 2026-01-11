from rest_framework.pagination import PageNumberPagination
from spa.pagination import TableRowPagination


def test_pagination_basics():
    """Проверка атрибутов пагинации."""
    pagination = TableRowPagination()

    assert pagination.page_size == 10
    assert pagination.page_size_query_param == "page_size"
    assert pagination.max_page_size == 20


def test_inheritance():
    """Проверка наследования."""
    assert issubclass(TableRowPagination, PageNumberPagination)
