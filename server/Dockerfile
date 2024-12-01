FROM python:3.12-alpine

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies for psycopg2
RUN apk update && apk add --no-cache \
    postgresql-dev gcc python3-dev musl-dev

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

# Upgrade pip
RUN pip install --upgrade pip

# Copy path to requirements.txt
COPY ./src/requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt. #Install dependencies without cache for smaller image size. Recommended for production.

#RUN python manage.py collectstatic --noinput

# Copy all the rest of the backend files 
COPY ./src/ .

# Command to run the application with Gunicorn
CMD ["gunicorn", "curio4.wsgi:application", "--bind", "0.0.0.0:8000"]