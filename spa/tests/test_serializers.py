import pytest

from spa.models import TableRow
from spa.serializers import TableRowSerializer


@pytest.mark.django_db
class TestTableRowSerializerValidation:
    """Проверка TableRowSerializer на валидацию данных."""

    def test_valid_data(self, model_CRUD_single_row_data):
        """Проверка сериализации при корректных входных данных."""

        serializer = TableRowSerializer(data=model_CRUD_single_row_data)

        assert serializer.is_valid()
        assert (
            str(serializer.validated_data["date"]) == model_CRUD_single_row_data["date"]
        )
        assert serializer.validated_data["name"] == model_CRUD_single_row_data["name"]
        assert (
            serializer.validated_data["quantity"]
            == model_CRUD_single_row_data["quantity"]
        )
        assert (
            serializer.validated_data["distance"]
            == model_CRUD_single_row_data["distance"]
        )

    def test_zero_values_are_valid(self, model_CRUD_single_row_data):
        """Проверка при допустимых нулевых значениях quantity и distance."""

        model_CRUD_single_row_data["quantity"] = 0
        model_CRUD_single_row_data["distance"] = 0
        serializer = TableRowSerializer(data=model_CRUD_single_row_data)

        assert serializer.is_valid()

    def test_invalid_date(self, model_CRUD_single_row_data):
        """Проверка сериализации при некорректной date (несоответствующей формату YYYY-MM-DD)."""

        data = model_CRUD_single_row_data
        data["date"] = "15.01.2025"

        serializer = TableRowSerializer(data=data)

        assert not serializer.is_valid()
        assert "date" in serializer.errors

    def test_invalid_name(self, model_CRUD_single_row_data):
        """Проверка сериализации при длине name более 300 символов."""

        data = model_CRUD_single_row_data
        data["name"] = "A" * 350

        serializer = TableRowSerializer(data=data)

        assert not serializer.is_valid()
        assert "name" in serializer.errors

    def test_invalid_quantity(self, model_CRUD_single_row_data):
        """Проверка сериализации при нечисловом значении или отрицательном или нецелом числовом значении quantity."""

        data = model_CRUD_single_row_data

        data["quantity"] = "abc"
        serializer = TableRowSerializer(data=data)
        assert not serializer.is_valid()
        assert "quantity" in serializer.errors

        data["quantity"] = -5
        serializer = TableRowSerializer(data=data)
        assert not serializer.is_valid()
        assert "quantity" in serializer.errors

        data["quantity"] = 12.5
        serializer = TableRowSerializer(data=data)
        assert not serializer.is_valid()
        assert "quantity" in serializer.errors

    def test_invalid_distance(self, model_CRUD_single_row_data):
        """Проверка сериализации при нечисловом значении или отрицательном или нецелом числовом значении distance."""

        data = model_CRUD_single_row_data

        data["distance"] = "abc"
        serializer = TableRowSerializer(data=data)
        assert not serializer.is_valid()
        assert "distance" in serializer.errors

        data["distance"] = -5
        serializer = TableRowSerializer(data=data)
        assert not serializer.is_valid()
        assert "distance" in serializer.errors

        data["distance"] = 12.5
        serializer = TableRowSerializer(data=data)
        assert not serializer.is_valid()
        assert "distance" in serializer.errors


@pytest.mark.django_db
def test_serializer_output_representation(model_CRUD_single_row_data):
    """Проверяет преобразование в словарь."""

    table_row = TableRow.objects.create(**model_CRUD_single_row_data)
    serializer = TableRowSerializer(table_row)
    data = serializer.data

    assert "id" in data
    assert "date" in data
    assert "name" in data
    assert "quantity" in data
    assert "distance" in data
    assert "created_at" not in data

    assert data["date"] == table_row.date
    assert data["name"] == table_row.name
    assert data["quantity"] == table_row.quantity
    assert data["distance"] == table_row.distance


@pytest.mark.django_db
def test_object_creat(model_CRUD_single_row_data):
    """Проверяет создание объекта модели через сериализатор."""

    serializer = TableRowSerializer(data=model_CRUD_single_row_data)
    assert serializer.is_valid()
    table_row = serializer.save()
    assert isinstance(table_row, TableRow)
    assert str(table_row.date) == model_CRUD_single_row_data["date"]
    assert table_row.name == model_CRUD_single_row_data["name"]
    assert table_row.quantity == model_CRUD_single_row_data["quantity"]
    assert table_row.distance == model_CRUD_single_row_data["distance"]


@pytest.mark.django_db
def test_object_update(model_CRUD_single_row_data):
    """Проверяет обновление данных объекта модели через сериализатор."""

    original_row = TableRow.objects.create(**model_CRUD_single_row_data)
    new_data = {
        "date": "1111-11-11",
        "name": "Новое название",
        "quantity": 111,
        "distance": 11,
    }

    serializer = TableRowSerializer(original_row, data=new_data, partial=True)
    assert serializer.is_valid()
    updated_row = serializer.save()
    assert updated_row.id == original_row.id
    assert str(updated_row.date) == new_data["date"]
    assert updated_row.name == new_data["name"]
    assert updated_row.quantity == new_data["quantity"]
    assert updated_row.distance == new_data["distance"]
