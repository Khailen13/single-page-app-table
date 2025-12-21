import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from spa.models import TableRow
from faker import Faker


class Command(BaseCommand):
    help = "Заполняет базу тестовыми данными для демонстрации"

    # Добавляем аргументы командной строки
    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=50,
            help="Количество записей для создания (по умолчанию 50)",
        )
        parser.add_argument(
            "--clear", action="store_true", help="Очистить таблицу перед заполнением"
        )

    def handle(self, *args, **options):
        count = options["count"]
        clear = options["clear"]

        if clear:
            TableRow.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("Таблица очищена"))

        for i in range(count):
            # Случайная дата в пределах +/- год
            days_ago = random.randint(-360, 360)
            date = timezone.now().date() - timezone.timedelta(days=days_ago)

            # Случайное название
            fake = Faker('ru_RU')
            name = self.generate_expedition_name(fake)

            # Случайные значения
            distance = random.randint(50,500) # Расстояние 50 - 500 км
            quantity = distance // 50 # Количество дней при средней скорости 50 км/день

            TableRow.objects.create(
                date=date, name=name, quantity=quantity, distance=distance
            )

            # Прогресс для больших объемов
            if i % 10 == 0:
                self.stdout.write(f"Создано {i}/{count} записей...")

        self.stdout.write(
            self.style.SUCCESS(f"Успешно создано {count} тестовых записей!")
        )

    @staticmethod
    def generate_expedition_name(fake):
        templates = [
            f"Экспедиция «{fake.word().capitalize()}» в {fake.country()}",
            f"Треккинг по {fake.region()} с {fake.company()}",
            f"Научно-исследовательская миссия: {fake.catch_phrase()}",
            f"{fake.city()} - {fake.city()} через {fake.word()}",
        ]
        return random.choice(templates)