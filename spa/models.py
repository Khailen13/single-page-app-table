from django.db import models


class TableRow(models.Model):
    date = models.DateField(verbose_name="Дата")
    name = models.CharField(max_length=300, verbose_name="Название")
    quantity = models.SmallIntegerField(verbose_name="Количество")
    distance = models.IntegerField(verbose_name="Расстояние")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Строка таблицы"
        verbose_name_plural = "Строки таблицы"

    def __str__(self):
        return f"{self.date}: {self.name} ({self.quantity} шт., {self.distance} км)"
