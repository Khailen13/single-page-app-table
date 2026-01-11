from rest_framework import serializers

from spa.models import TableRow


class TableRowSerializer(serializers.ModelSerializer):

    def validate_quantity(self, value):
        """Проверяет, что значение поля quantity не отрицательно."""

        if value < 0:
            raise serializers.ValidationError("Количество не может быть отрицательным")
        return value

    def validate_distance(self, value):
        """Проверяет, что значение поля distance не отрицательно."""

        if value < 0:
            raise serializers.ValidationError("Расстояние не может быть отрицательным")
        return value

    class Meta:
        model = TableRow
        exclude = ["created_at"]
