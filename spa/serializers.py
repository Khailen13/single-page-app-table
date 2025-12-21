from rest_framework import serializers

from spa.models import TableRow


class TableRowSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%d-%m-%Y", input_formats=["%d-%m-%Y"])

    class Meta:
        model = TableRow
        exclude = ["created_at"]
