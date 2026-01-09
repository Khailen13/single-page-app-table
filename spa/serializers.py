from rest_framework import serializers

from spa.models import TableRow


class TableRowSerializer(serializers.ModelSerializer):

    class Meta:
        model = TableRow
        exclude = ["created_at"]
