import pytest
from django.core.exceptions import ValidationError
from django_filters import FilterSet

from spa.filters import TableRowFilter
from spa.models import TableRow


@pytest.mark.django_db
class TestTableRowFilter:
    """Тестирование TableRowFilter."""

    def test_filter_class_inheritance(self):
        """Проверяет наследование TableRowFilter от FilterSet."""
        assert issubclass(TableRowFilter, FilterSet)

    def test_filter_meta_class(self):
        """Проверяет соответствие модели."""
        assert TableRowFilter.Meta.model == TableRow

    def test_empty_filter_returns_all(self, model_query_rows):
        """Пустой фильтр возвращает все записи."""
        queryset = TableRow.objects.all()
        result = TableRowFilter({}, queryset=queryset).qs
        assert result.count() == 3

    def test_filter_name_exact(self, model_query_rows):
        """Проверяет фильтрацию по полю name по условию точного соответствия."""
        queryset = TableRow.objects.all()
        result = TableRowFilter({"name": "А-Название"}, queryset=queryset).qs
        assert result.count() == 1

    def test_filter_name_icontains(self, model_query_rows):
        """Фильтрация по содержанию части названия."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"name__icontains": "А-Наз"}, queryset=queryset).qs
        assert result.count() == 1

    def test_filter_date_exact(self, model_query_rows):
        """Фильтрация по точному соответствию даты."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"date": "2025-12-02"}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "В-Название"

    def test_filter_date_gt(self, model_query_rows):
        """Фильтрация по наименьшей дате."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"date__gt": "2025-12-02"}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "Б-Название"

    def test_filter_date_lt(self, model_query_rows):
        """Фильтрация по наибольшей дате."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"date__lt": "2025-12-02"}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "А-Название"

    def test_filter_quantity_exact(self, model_query_rows):
        """Фильтрация по точному соответствию количества."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"quantity": 3}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "А-Название"

    def test_filter_quantity_gt(self, model_query_rows):
        """Фильтрация по наименьшему количеству."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"quantity__gt": 3}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "Б-Название"

    def test_filter_quantity_lt(self, model_query_rows):
        """Фильтрация по наибольшему количеству."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"quantity__lt": 3}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "В-Название"

    def test_filter_distance_exact(self, model_query_rows):
        """Фильтрация по точному соответствию расстояния."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"distance": 50}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "А-Название"

    def test_filter_distance_gt(self, model_query_rows):
        """Фильтрация по наименьшему расстоянию."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"distance__gt": 50}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "В-Название"

    def test_filter_distance_lt(self, model_query_rows):
        """Фильтрация по наибольшему расстоянию."""

        queryset = TableRow.objects.all()
        result = TableRowFilter({"distance__lt": 50}, queryset=queryset).qs
        assert result.count() == 1
        assert result[0].name == "Б-Название"

    def test_unknown_field_filter_raises_error(self, model_query_rows):
        """Тест неизвестного поля фильтра."""
        queryset = TableRow.objects.all()

        filterset = TableRowFilter(data={"unknown_field": "value"}, queryset=queryset)

        with pytest.raises(ValidationError) as exc_info:
            _ = filterset.qs

        error_msg = str(exc_info.value)
        assert "не существует" in error_msg or "не поддерживает" in error_msg

    def test_invalid_operator_for_field_raises_error(self, model_query_rows):
        """Тест недопустимого оператора для поля."""
        queryset = TableRow.objects.all()

        with pytest.raises(ValidationError) as exc_info:
            filterset = TableRowFilter(
                data={"quantity__icontains": "10"}, queryset=queryset
            )
            _ = filterset.qs

        error_msg = str(exc_info.value)
        assert "доступны операторы" in error_msg
        assert "exact, gt, lt" in error_msg

    def test_invalid_numeric_value_raises_error(self, model_query_rows):
        """Тест некорректного числового значения."""
        queryset = TableRow.objects.all()

        # Тест 1: Не число
        filterset = TableRowFilter(data={"quantity__gt": "abc"}, queryset=queryset)

        assert not filterset.is_valid()
        assert "quantity__gt" in filterset.errors

        errors = filterset.errors["quantity__gt"]
        assert len(errors) > 0

        # Тест 2: Отрицательное число
        filterset2 = TableRowFilter(data={"distance": "-5"}, queryset=queryset)
        assert not filterset2.is_valid()
        assert "distance" in filterset2.errors

    def test_valid_filters_pass_validation(self, model_query_rows):
        """Тест, что корректные фильтры проходят валидацию."""
        queryset = TableRow.objects.all()

        valid_filters = [
            {"name__icontains": "test"},
            {"quantity__gt": "10"},
            {"distance__lt": "100"},
            {"date": "2024-01-01"},
        ]

        for filter_data in valid_filters:
            filterset = TableRowFilter(data=filter_data, queryset=queryset)
            _ = filterset.qs
            assert filterset.is_valid()
