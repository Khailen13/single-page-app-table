import pytest
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse
from spa.models import TableRow


@pytest.mark.django_db
class TestTableRowEndpoints:
    """CRUD операции."""

    def setup_method(self):
        """Настройка перед каждым тестом."""
        self.client = APIClient()
        self.list_url = reverse("spa:table-list")

    def test_get_list_returns_all_items(self, model_query_rows):
        """GET запрос возвращает все элементы."""
        response = self.client.get(self.list_url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 3

    def test_post_creates_new_item(self):
        """POST запрос создает новый элемент."""
        data = {
            "date": "2024-01-01",
            "name": "Новый элемент",
            "quantity": 10,
            "distance": 100,
        }
        response = self.client.post(self.list_url, data)
        assert response.status_code == 201
        assert TableRow.objects.count() == 1
        assert TableRow.objects.first().name == "Новый элемент"

    def test_put_updates_item(self, model_query_rows):
        """PUT запрос обновляет элемент."""
        item = model_query_rows[0]
        detail_url = reverse("spa:table-detail", args=[item.id])

        data = {
            "date": "2024-12-31",
            "name": "Обновленное название",
            "quantity": 99,
            "distance": 999,
        }

        response = self.client.put(detail_url, data)
        assert response.status_code == 200

        item.refresh_from_db()
        assert item.name == "Обновленное название"
        assert item.quantity == 99

    def test_delete_removes_item(self, model_query_rows):
        """DELETE запрос удаляет элемент."""
        item = model_query_rows[0]
        detail_url = reverse("spa:table-detail", args=[item.id])

        response = self.client.delete(detail_url)
        assert response.status_code == 204
        assert TableRow.objects.count() == 2


@pytest.mark.django_db
class TestTableRowFiltering:
    """Фильтрация."""

    def setup_method(self):
        """Настройка перед каждым тестом."""
        self.client = APIClient()
        self.list_url = reverse("spa:table-list")

    def test_empty_filter_returns_all(self, model_query_rows):
        """Пустой фильтр возвращает все записи."""
        response = self.client.get(self.list_url, {})
        assert response.status_code == 200
        assert len(response.data["results"]) == 3

    def test_filter_name_exact(self, model_query_rows):
        """Проверяет фильтрацию по полю name по условию точного соответствия."""
        response = self.client.get(self.list_url, {"name": "А-Название"})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_filter_by_name(self, model_query_rows):
        """Фильтрация по имени через параметры."""
        response = self.client.get(self.list_url, {"name__icontains": "А-Наз"})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "А-Название"

    def test_filter_date_exact(self, model_query_rows):
        """Фильтрация по точному соответствию даты."""
        response = self.client.get(self.list_url, {"date": "2025-12-02"})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1

    def test_filter_date_gt(self, model_query_rows):
        """Фильтрация по наименьшей дате."""
        response = self.client.get(self.list_url, {"date__gt": "2025-12-02"})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Б-Название"

    def test_filter_date_lt(self, model_query_rows):
        """Фильтрация по наибольшей дате."""
        response = self.client.get(self.list_url, {"date__lt": "2025-12-02"})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "А-Название"

    def test_filter_quantity_exact(self, model_query_rows):
        """Фильтрация по точному соответствию количества."""
        response = self.client.get(self.list_url, {"quantity": 3})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "А-Название"

    def test_filter_quantity_gt(self, model_query_rows):
        """Фильтрация по наименьшему количеству."""
        response = self.client.get(self.list_url, {"quantity__gt": 3})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Б-Название"

    def test_filter_quantity_lt(self, model_query_rows):
        """Фильтрация по наибольшему количеству."""
        response = self.client.get(self.list_url, {"quantity__lt": 3})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "В-Название"

    def test_filter_distance_exact(self, model_query_rows):
        """Фильтрация по точному соответствию расстояния."""
        response = self.client.get(self.list_url, {"distance": 50})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "А-Название"

    def test_filter_distance_gt(self, model_query_rows):
        """Фильтрация по наименьшему расстоянию."""
        response = self.client.get(self.list_url, {"distance__gt": 50})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "В-Название"

    def test_filter_distance_lt(self, model_query_rows):
        """Фильтрация по наибольшему расстоянию."""
        response = self.client.get(self.list_url, {"distance__lt": 50})
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Б-Название"


@pytest.mark.django_db
class TestTableRowSorting:
    """Сортировка."""

    def setup_method(self):
        """Настройка перед каждым тестом."""
        self.client = APIClient()
        self.list_url = reverse("spa:table-list")

    def test_ordering_by_name_asc(self, model_query_rows):
        """Тест сортировки по name по возрастанию."""
        response = self.client.get(self.list_url, {"ordering": "name"})
        assert response.status_code == status.HTTP_200_OK

        results = response.data["results"]
        names = [item["name"] for item in results]
        assert names == ["А-Название", "Б-Название", "В-Название"]

    def test_ordering_by_name_desc(self, model_query_rows):
        """Тест сортировки по name по убыванию."""
        response = self.client.get(self.list_url, {"ordering": "-name"})
        assert response.status_code == status.HTTP_200_OK

        results = response.data["results"]
        names = [item["name"] for item in results]
        assert names == ["В-Название", "Б-Название", "А-Название"]

    def test_ordering_by_quantity_asc(self, model_query_rows):
        """Тест сортировки по quantity возрастанию."""
        response = self.client.get(self.list_url, {"ordering": "quantity"})
        assert response.status_code == status.HTTP_200_OK

        results = response.data["results"]
        quantities = [item["quantity"] for item in results]
        assert quantities == [1, 3, 5]

    def test_ordering_by_quantity_desc(self, model_query_rows):
        """Тест сортировки по quantity по убыванию."""
        response = self.client.get(self.list_url, {"ordering": "-quantity"})
        assert response.status_code == status.HTTP_200_OK

        results = response.data["results"]
        quantities = [item["quantity"] for item in results]
        assert quantities == [5, 3, 1]

    def test_ordering_by_distance_asc(self, model_query_rows):
        """Тест сортировки по distance по возрастанию."""
        response = self.client.get(self.list_url, {"ordering": "distance"})
        assert response.status_code == status.HTTP_200_OK

        results = response.data["results"]
        quantities = [item["distance"] for item in results]
        assert quantities == [5, 50, 100]

    def test_ordering_by_distance_desc(self, model_query_rows):
        """Тест сортировки по distance по убыванию."""
        response = self.client.get(self.list_url, {"ordering": "-distance"})
        assert response.status_code == status.HTTP_200_OK

        results = response.data["results"]
        quantities = [item["distance"] for item in results]
        assert quantities == [100, 50, 5]


@pytest.mark.django_db
class TestTableRowPaginationAPI:
    """Пагинация через API."""

    def setup_method(self):
        self.client = APIClient()
        self.list_url = reverse("spa:table-list")

    def test_pagination_default_size(self):
        """Пагинация по умолчанию (10 записей)."""

        for i in range(15):
            TableRow.objects.create(
                date=f"2025-01-{i + 1:02d}",
                name=f"Запись {i}",
                quantity=i,
                distance=i * 10,
            )

        response = self.client.get(self.list_url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 10
        assert response.data["count"] == 15
        assert response.data["next"] is not None

    def test_pagination_custom_page_size(self):
        """Пагинация с кастомным размером страницы."""

        for i in range(15):
            TableRow.objects.create(
                date=f"2025-01-{i + 1:02d}",
                name=f"Запись {i}",
                quantity=i,
                distance=i * 10,
            )

        response = self.client.get(self.list_url, {"page_size": 5})
        assert response.status_code == 200
        assert len(response.data["results"]) == 5
        assert response.data["count"] == 15
