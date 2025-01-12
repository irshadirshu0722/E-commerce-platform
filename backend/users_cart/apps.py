from django.apps import AppConfig

class UsersCartConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users_cart'
    def ready(self):
        import users_cart.signals
