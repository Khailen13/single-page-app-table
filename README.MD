# Таблица в формате SPA
## Описание проекта

Проект представляет собой веб-приложение для отображения и управления табличными данными в формате Single Page Application (SPA). Приложение позволяет просматривать, сортировать, фильтровать данные с пагинацией, все операции выполняются без перезагрузки страницы.

### Основные функции
- Отображение таблицы с данными: Дата, Название, Количество, Расстояние
- Сортировка по всем полям (кроме даты)
- Фильтрация с выбором колонки, условия и значения
- Серверная пагинация данных
- Автоматическое заполнение базы тестовыми данными

## Технологический стек

### Backend
- `Python 3.11`
- `Django 4.2 + Django REST Framework`
- `PostgreSQL`
- `Gunicorn`
- `Django Filter` для фильтрации
- `Poetry` для управления зависимостями
- `Pytest` для тестирования

### Frontend
- `React 18`
- `Axios` для HTTP-запросов
- `Bootstrap 5` для стилизации
- `React Hooks` для управления состоянием
- `Jest + React Testing Library` для тестирования

### Инфраструктура
- `Docker + Docker Compose`
- `Nginx` для проксирования

## Структура проекта
```
Diploma/
├── config/ # Настройки Django
├── spa/ # Основное Django приложение
│ ├── models.py # Модель TableRow
│ ├── views.py # ViewSet для API
│ ├── serializers.py # Сериализаторы
│ ├── filters.py # Фильтры для API
│ ├── pagination.py # Настройки пагинации
│ ├── tests/ # Тесты backend
│ └── management/ # Команды для заполнения данных
├── frontend/ # React приложение
│ ├── src/
│ │ ├── components/ # React компоненты
│ │ ├── utils/ # Утилиты и API конфигурация
│ │ └── App.js # Главный компонент
│ └── Dockerfile.frontend # Dockerfile для фронтенда
├── htmlcov/ # Отчет о тестировании pytest
├── nginx/ # Конфигурация Nginx
├── docker-compose.yml # Docker Compose конфигурация
├── Dockerfile.backend # Dockerfile для бэкенда
├── pyproject.toml # Конфигурация Poetry и зависимостей
├── poetry.lock # Фиксированные версии зависимостей
├── requirements.txt # Python зависимости (для Docker)
└── .env.sample # Шаблон переменных окружения
```
## Установка и запуск

### Предварительные требования
- Docker и Docker Compose
- Git

### 1. Клонирование репозитория
```
git clone https://github.com/Khailen13/Diploma.git
cd Diploma
```
### 2. Настройка окружения
Создайте файл .env на основе .env.sample и отредактируйте .env, заполнив необходимые значения.

### 3. Запуск через Docker Compose
```
docker-compose up --build
```
Приложение будет доступно по адресу: `http://localhost`.

### 4. Остановка приложения
```
docker-compose down
```
## Заполнение тестовыми данными

При первом запуске база данных автоматически заполняется 50 тестовыми записями. Для повторного заполнения выполните:

```
docker-compose exec backend python manage.py autofilling --count 100 --clear
```
Опции команды:

* --count _N_ - количество записей (по умолчанию 50)
* --clear - очистить таблицу перед заполнением

После запуска приложения доступна автоматически сгенерированная документация API:

- **Swagger UI:** `http://localhost/swagger/`
- **ReDoc:** `http://localhost/redoc/`

### Основные эндпоинты

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | `/spa/table/` | Список записей с пагинацией |
| POST | `/spa/table/` | Создание новой записи |
| GET | `/spa/table/{id}/` | Детали записи |
| PUT | `/spa/table/{id}/` | Обновление записи |
| DELETE | `/spa/table/{id}/` | Удаление записи |

### Параметры запросов

#### Фильтрация

| Параметр | Пример | Описание |
|----------|--------|----------|
| `name=значение` | `name=Экспедиция` | Точное совпадение |
| `name__icontains=часть` | `name__icontains=эксп` | Содержит часть строки |
| `quantity=число` | `quantity=10` | Равно |
| `quantity__gt=число` | `quantity__gt=5` | Больше |
| `quantity__lt=число` | `quantity__lt=20` | Меньше |
| `distance=число` | `distance=100` | Равно |
| `distance__gt=число` | `distance__gt=50` | Больше |
| `distance__lt=число` | `distance__lt=200` | Меньше |
| `date=YYYY-MM-DD` | `date=2024-01-15` | Равно |
| `date__gt=YYYY-MM-DD` | `date__gt=2024-01-01` | После даты |
| `date__lt=YYYY-MM-DD` | `date__lt=2024-12-31` | До даты |

#### Сортировка

* ordering=name # по возрастанию
* ordering=-name # по убыванию
* ordering=quantity # по количеству
* ordering=-distance # по расстоянию (убывание)

#### Пагинация

* page=номер_страницы # номер страницы (начинается с 1)
* page_size=размер # элементов на странице (5-20)

### Примеры запросов

1. Получить записи со второй страницы (по 10 элементов):
```
GET /spa/table/?page=2&page_size=10
```
2. Фильтрация по количеству больше 5:
```
GET /spa/table/?quantity__gt=5
```
3. Сортировка по названию по убыванию:
```
GET /spa/table/?ordering=-name
```
4. Комбинированный запрос:
```
GET /spa/table/?name__icontains=экспедиция&quantity__gt=3&ordering=distance&page=1&page_size=5
```
## Тестирование
Проект имеет комплексную систему тестирования как backend, так и frontend частей.
### Backend тестирование
#### Запуск тестов
```
# Запуск всех тестов с отчетом о покрытии
docker-compose exec backend pytest

# Запуск конкретного модуля тестов
docker-compose exec backend pytest spa/tests/test_views.py

# Тесты с детальным выводом
docker-compose exec backend pytest -v

# Генерация HTML отчета о покрытии
docker-compose exec backend pytest --cov-report=html
```
#### Структура тестов
- `test_models.py` - тесты моделей и CRUD операций
- `test_views.py` - тесты API эндпоинтов
- `test_filters.py` - тесты фильтрации
- `test_serializers.py` - тесты сериализаторов
- `test_pagination.py` - тесты пагинации
#### Покрытие кода
Текущее покрытие тестами составляет 95%. Отчет доступен после запуска тестов в директории `htmlcov/`.

### Frontend тестирование
#### Запуск тестов
```
# Перейдите в директорию frontend
cd frontend

# Установите зависимости
npm install

# Запустите тесты
npm test

# Для отчета о покрытии
npm test -- --coverage --watchAll=false
````
#### Структура тестов

* `App.test.js` - тесты главного компонента

* `components/Table/*.test.js` - тесты компонентов таблицы

* `components/Filters/*.test.js` - тесты компонентов фильтров

* `components/Pagination/*.test.js` - тесты пагинации

* `utils/*.test.js` - тесты утилит

#### Покрытие кода
Текущее покрытие тестами frontend составляет 76%. 

Отчет доступен после запуска тестов в директории `frontend/coverage/lcov-report/`.

## Архитектурные решения

### Серверная обработка
Все операции (фильтрация, сортировка, пагинация) выполняются на сервере, что обеспечивает:
- Высокую производительность с большими объемами данных
- Минимальную передачу данных по сети
- Согласованность данных между клиентом и сервером

### Контейнеризация
Проект использует Docker Compose для оркестрации 4 сервисов:
1. PostgreSQL - база данных
2. Backend (Django) - API сервер
3. Frontend (React) - клиентское приложение
4. Nginx - прокси и статический сервер

### Безопасность
- Настроены CORS заголовки для контролируемого доступа
- Валидация входных данных на сервере
- Использование переменных окружения для конфиденциальных данных

## Разработка

### Локальная разработка без Docker

#### Backend
```
cd Diploma

# Активация виртуального окружения Poetry
poetry shell

# Установка зависимостей
poetry install

# Применение миграций
poetry run python manage.py migrate

# Заполнение тестовыми данными
poetry run python manage.py autofilling --count 20

# Запуск сервера разработки
poetry run python manage.py runserver
```
#### Frontend
```
cd Diploma/frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start
```
