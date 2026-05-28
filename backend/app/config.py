from dotenv import load_dotenv

import os


load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = os.getenv(
    "ALGORITHM"
)

MAIL_USERNAME = os.getenv(
    "MAIL_USERNAME"
)

MAIL_PASSWORD = os.getenv(
    "MAIL_PASSWORD"
)

MAIL_FROM = os.getenv(
    "MAIL_FROM"
)

MAIL_PORT = int(
    os.getenv("MAIL_PORT")
)

MAIL_SERVER = os.getenv(
    "MAIL_SERVER"
)