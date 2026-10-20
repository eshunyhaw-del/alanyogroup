from django.db import models


class Enquiry(models.Model):
    class Topic(models.TextChoices):
        GENERAL = "general", "General"
        ABROAD = "abroad", "Customer abroad"
        PROJECTS = "projects", "Major project"
        PRODUCT = "product", "About a product"

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    topic = models.CharField(max_length=10, choices=Topic.choices, default=Topic.GENERAL)
    message = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    notified_at = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self) -> str:
        return f"{self.get_topic_display()}: {self.name}"
