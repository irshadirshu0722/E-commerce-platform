from django.apps import AppConfig


class UserFeedbackConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_feedback'
    def ready(self) -> None:
        import user_feedback.signals
