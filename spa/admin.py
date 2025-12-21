from django.contrib import admin

from spa.models import TableRow


@admin.register(TableRow)
class TableRowAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "date",
        "name",
        "quantity",
        "distance",
    )

    list_filter = [
        'date',
        'name',
        'quantity',
        'distance',
    ]

    search_fields = ['name',]

    ordering = ['-date']
