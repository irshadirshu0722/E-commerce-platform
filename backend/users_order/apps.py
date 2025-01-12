from django.apps import AppConfig


class UsersOrderConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users_order'

    def ready(self):
        import users_order.signals
