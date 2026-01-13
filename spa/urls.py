from django.urls import include, path
from rest_framework.routers import SimpleRouter

from spa.apps import SpaConfig
from spa.views import TableRowViewSet

app_name = SpaConfig.name

router = SimpleRouter()
router.register(r"table", TableRowViewSet, basename="table")
urlpatterns = [
    path("", include(router.urls)),
]
