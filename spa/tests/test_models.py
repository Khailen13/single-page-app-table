from spa.models import TableRow
import pytest


@pytest.mark.django_db
class TestTableRowCRUD:
    """Проверка CRUD-операций для модели TableRow."""

    @pytest.fixture(autouse=True)
    def setup(self, model_CRUD_single_row_data):
        """Автоматическое создание строки таблицы для каждого теста данного класса"""

        self.model_CRUD_single_row_data = model_CRUD_single_row_data
        self.row = TableRow.objects.create(**model_CRUD_single_row_data)
        yield

    def test_create(self):
        """Проверка данных созданной строки модели."""

        assert str(self.row.date) == self.model_CRUD_single_row_data["date"]
        assert self.row.name == self.model_CRUD_single_row_data["name"]
        assert self.row.quantity == self.model_CRUD_single_row_data["quantity"]
        assert self.row.distance == self.model_CRUD_single_row_data["distance"]
        assert self.row.created_at is not None

    def test_update(self):
        """Проверка изменения данных строки модели."""

        created_at_data = self.row.created_at
        self.row.date = "1111-11-11"
        self.row.name = "name1"
        self.row.quantity = 1
        self.row.distance = 11
        self.row.save()
        self.row.refresh_from_db()
        assert str(self.row.date) == "1111-11-11"
        assert self.row.name == "name1"
        assert self.row.quantity == 1
        assert self.row.distance == 11
        assert self.row.created_at == created_at_data

    def test_delete(self):
        """Проверка удаления строки модели."""

        assert TableRow.objects.all().count() == 1
        self.row.delete()
        assert TableRow.objects.all().count() == 0

    def test_string_representation(self):
        expected = "2025-12-01: Тестовая запись (5 шт., 50 км)"
        assert str(self.row) == expected


@pytest.mark.django_db
class TestTableRowQuery:
    """Проверка запросов по фильтрации и сортировке для модели TableRow."""

    def test_filter_name_exact(self, model_query_rows):
        """Фильтрация по точному соответствию названия."""

        result = TableRow.objects.filter(name__exact="А-Название")
        assert result.count() == 1

    def test_filter_name_icontains(self, model_query_rows):
        """Фильтрация по содержанию части названия."""

        result1 = TableRow.objects.filter(name__icontains="А-Наз")
        assert result1.count() == 1
        result2 = TableRow.objects.filter(name__icontains="Название")
        assert result2.count() == 3

    def test_filter_date_exact(self, model_query_rows):
        """Фильтрация по точному соответствию даты."""

        result = TableRow.objects.filter(date__exact="2025-12-02")
        assert result.count() == 1
        assert result[0].name == "В-Название"

    def test_filter_date_gt(self, model_query_rows):
        """Фильтрация по наименьшей дате."""

        result = TableRow.objects.filter(date__gt="2025-12-02")
        assert result.count() == 1
        assert result[0].name == "Б-Название"

    def test_filter_date_lt(self, model_query_rows):
        """Фильтрация по наибольшей дате."""

        result = TableRow.objects.filter(date__lt="2025-12-02")
        assert result.count() == 1
        assert result[0].name == "А-Название"

    def test_filter_quantity_exact(self, model_query_rows):
        """Фильтрация по точному соответствию количества."""

        result = TableRow.objects.filter(quantity__exact=3)
        assert result.count() == 1
        assert result[0].name == "А-Название"

    def test_filter_quantity_gt(self, model_query_rows):
        """Фильтрация по наименьшему количеству."""

        result = TableRow.objects.filter(quantity__gt=3)
        assert result.count() == 1
        assert result[0].name == "Б-Название"

    def test_filter_quantity_lt(self, model_query_rows):
        """Фильтрация по наибольшему количеству."""

        result = TableRow.objects.filter(quantity__lt=3)
        assert result.count() == 1
        assert result[0].name == "В-Название"

    def test_filter_distance_exact(self, model_query_rows):
        """Фильтрация по точному соответствию расстояния."""

        result = TableRow.objects.filter(distance__exact=50)
        assert result.count() == 1
        assert result[0].name == "А-Название"

    def test_filter_distance_gt(self, model_query_rows):
        """Фильтрация по наименьшему расстоянию."""

        result = TableRow.objects.filter(distance__gt=50)
        assert result.count() == 1
        assert result[0].name == "В-Название"

    def test_filter_distance_lt(self, model_query_rows):
        """Фильтрация по наибольшему расстоянию."""

        result = TableRow.objects.filter(distance__lt=50)
        assert result.count() == 1
        assert result[0].name == "Б-Название"

    def test_ordering_name_asc(self, model_query_rows):
        """Сортировка по названию по возрастанию."""

        results = TableRow.objects.order_by("name")
        assert [item.name for item in results] == [
            "А-Название",
            "Б-Название",
            "В-Название",
        ]

    def test_ordering_name_desc(self, model_query_rows):
        """Сортировка по названию по убыванию."""

        results = TableRow.objects.order_by("-name")
        assert [item.name for item in results] == [
            "В-Название",
            "Б-Название",
            "А-Название",
        ]

    def test_ordering_quantity_asc(self, model_query_rows):
        """Сортировка по количеству по возрастанию."""

        results = TableRow.objects.order_by("quantity")
        assert [item.quantity for item in results] == [1, 3, 5]

    def test_ordering_quantity_desc(self, model_query_rows):
        """Сортировка по количеству по убыванию."""

        results = TableRow.objects.order_by("-quantity")
        assert [item.quantity for item in results] == [5, 3, 1]

    def test_ordering_distance_asc(self, model_query_rows):
        """Сортировка по расстоянию по возрастанию."""

        results = TableRow.objects.order_by("distance")
        assert [item.distance for item in results] == [5, 50, 100]

    def test_ordering_distance_desc(self, model_query_rows):
        """Сортировка по расстоянию по убыванию."""

        results = TableRow.objects.order_by("-distance")
        assert [item.distance for item in results] == [100, 50, 5]

    def test_combined_filter_and_order(self, model_query_rows):
        """Сортировка с учетом фильтрации."""

        results = TableRow.objects.filter(distance__gt=5).order_by("distance")
        assert [item.distance for item in results] == [50, 100]
