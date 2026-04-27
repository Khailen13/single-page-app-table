import pytest

from spa.models import TableRow


@pytest.fixture
def model_CRUD_single_row_data():
    """Данные строки для проверки CRUD-операций над моделью."""

    return {
        "date": "2025-12-01",
        "name": "Тестовая запись",
        "quantity": 5,
        "distance": 50,
    }


@pytest.fixture
def model_query_rows():
    """Строки модели для проверки фильтрации и сортировки."""

    row1 = TableRow.objects.create(
        date="2025-12-01", name="А-Название", quantity=3, distance=50
    )

    row2 = TableRow.objects.create(
        date="2025-12-03", name="Б-Название", quantity=5, distance=5
    )

    row3 = TableRow.objects.create(
        date="2025-12-02", name="В-Название", quantity=1, distance=100
    )

    return [row1, row2, row3]
