import django_filters
from django.core.exceptions import ValidationError
from .models import TableRow


def validate_positive_integer(value):
    """Валидация положительного целого числа."""
    if value is None:
        return value

    try:
        int_value = int(value)
        if int_value < 0:
            raise ValidationError("Значение не может быть отрицательным")
        return int_value
    except (ValueError, TypeError):
        raise ValidationError("Должно быть целым числом")


class TableRowFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="exact", field_name="name")
    name__icontains = django_filters.CharFilter(
        lookup_expr="icontains", field_name="name"
    )

    quantity = django_filters.NumberFilter(
        lookup_expr="exact",
        field_name="quantity",
        validators=[validate_positive_integer],
    )
    quantity__gt = django_filters.NumberFilter(
        lookup_expr="gt", field_name="quantity", validators=[validate_positive_integer]
    )
    quantity__lt = django_filters.NumberFilter(
        lookup_expr="lt", field_name="quantity", validators=[validate_positive_integer]
    )

    distance = django_filters.NumberFilter(
        lookup_expr="exact",
        field_name="distance",
        validators=[validate_positive_integer],
    )
    distance__gt = django_filters.NumberFilter(
        lookup_expr="gt", field_name="distance", validators=[validate_positive_integer]
    )
    distance__lt = django_filters.NumberFilter(
        lookup_expr="lt", field_name="distance", validators=[validate_positive_integer]
    )

    date = django_filters.DateFilter(lookup_expr="exact", field_name="date")
    date__gt = django_filters.DateFilter(lookup_expr="gt", field_name="date")
    date__lt = django_filters.DateFilter(lookup_expr="lt", field_name="date")

    @property
    def qs(self):
        """Переопределение для гарантированной валидации."""
        if not hasattr(self, "_qs"):
            self.is_valid()
            self._qs = super().qs
        return self._qs

    def is_valid(self):
        is_valid = super().is_valid()
        if self.data:
            filtered_data = {
                k: v
                for k, v in self.data.items()
                if k not in ["ordering", "page", "page_size", "format"]
            }
            self._validate_parameters(filtered_data)
        return is_valid

    def _validate_parameters(self, data):
        """Проверяет корректность переданных параметров."""
        allowed_filters = {
            "name": ["exact", "icontains"],
            "quantity": ["exact", "gt", "lt"],
            "distance": ["exact", "gt", "lt"],
            "date": ["exact", "gt", "lt"],
        }

        for param, value in data.items():
            if not param or value == "":
                continue

            parts = param.split("__")
            field = parts[0]
            operator = parts[1] if len(parts) > 1 else "exact"

            if field not in allowed_filters:
                raise ValidationError(
                    f"Поле '{field}' не существует или не поддерживает фильтрацию"
                )

            if operator not in allowed_filters[field]:
                allowed = ", ".join(allowed_filters[field])
                raise ValidationError(
                    f"Для поля '{field}' доступны операторы: {allowed}. "
                    f"Получен: '{operator}'"
                )

    class Meta:
        model = TableRow
        fields = {
            "name": ["exact", "icontains"],
            "quantity": ["exact", "gt", "lt"],
            "distance": ["exact", "gt", "lt"],
            "date": ["exact", "gt", "lt"],
        }
