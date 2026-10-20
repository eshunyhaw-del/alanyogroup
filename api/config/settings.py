"""Alanyo Group API settings. All environment-specific values come from env vars (see .env.example)."""

from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
    ORDER_NOTIFY_EMAILS=(list, []),
)
environ.Env.read_env(BASE_DIR / ".env")

DEBUG = env("DEBUG")
# No insecure default outside DEBUG: production must supply SECRET_KEY.
SECRET_KEY = env("SECRET_KEY", default="dev-only-not-a-secret" if DEBUG else environ.Env.NOTSET)
ALLOWED_HOSTS = env("ALLOWED_HOSTS")
if env("VERCEL", default=""):
    # Deployment and preview URLs on Vercel. Add custom domains through ALLOWED_HOSTS.
    ALLOWED_HOSTS = [*ALLOWED_HOSTS, ".vercel.app"]

# Public address of the storefront. Paystack sends customers back to SITE_URL/order/confirmation.
SITE_URL = env("SITE_URL", default="http://localhost:3000").rstrip("/")

# Paystack. The secret key lives only on the server: never in the browser, never in git.
PAYSTACK_SECRET_KEY = env("PAYSTACK_SECRET_KEY", default="")
PAYSTACK_BASE_URL = "https://api.paystack.co"
PAYSTACK_TIMEOUT_SECONDS = 8  # fits inside a serverless function's time limit
PAYSTACK_CURRENCY = "GHS"
# Optional extra layer on top of the webhook signature: comma-separated source IPs Paystack publishes.
PAYSTACK_WEBHOOK_IPS = [ip.strip() for ip in env.list("PAYSTACK_WEBHOOK_IPS", default=[]) if ip.strip()]

ORDER_NOTIFY_EMAILS = [e.strip() for e in env("ORDER_NOTIFY_EMAILS") if e.strip()]
# Where website enquiries are sent.
ENQUIRY_EMAILS = [e.strip() for e in env.list("ENQUIRY_EMAILS", default=["sales@alanyogroup.com"]) if e.strip()]
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="Alanyo Group <sales@alanyogroup.com>")
EMAIL_BACKEND = env("EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = env("EMAIL_HOST", default="localhost")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "apps.catalog",
    "apps.carts",
    "apps.orders",
    "apps.payments",
    "apps.enquiries",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# API routes have no trailing slash (the storefront proxy strips them), so do not redirect to add one.
APPEND_SLASH = False
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# Staff admin lives at a configurable path so it is not the first thing a scanner tries.
ADMIN_URL = env("ADMIN_URL", default="admin/").lstrip("/")

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# PostgreSQL in production; connection reuse keeps per-request overhead low. SQLite is for local
# development only (DATABASE_URL=sqlite:///db.sqlite3).
DATABASES = {
    "default": env.db("DATABASE_URL", default="postgres://alanyo:alanyo@localhost:5432/alanyo")
}
DATABASES["default"]["CONN_MAX_AGE"] = 60
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Redis when configured (shared throttling across instances); otherwise a per-process cache.
_redis = env("REDIS_URL", default="")
CACHES = {
    "default": (
        {"BACKEND": "django.core.cache.backends.redis.RedisCache", "LOCATION": _redis}
        if _redis
        else {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}
    )
}

CELERY_BROKER_URL = env("CELERY_BROKER_URL", default="redis://localhost:6379/1")
# Without a broker, background tasks run inline so notifications still go out.
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=not env("CELERY_BROKER_URL", default=""))
CELERY_TASK_EAGER_PROPAGATES = False

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle"],
    "DEFAULT_THROTTLE_RATES": {"anon": "120/min", "checkout": "10/min", "order_lookup": "40/min", "enquiry": "5/min"},
    "UNAUTHENTICATED_USER": None,
}

# A checkout request is a few kilobytes; refuse anything much larger.
DATA_UPLOAD_MAX_MEMORY_SIZE = 256 * 1024

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 12}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Africa/Accra"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Browser-facing hardening that applies in every environment.
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

if not DEBUG:
    SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Logs never include request bodies, keys or card data.
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"plain": {"format": "%(levelname)s %(name)s %(message)s"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "plain"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}
