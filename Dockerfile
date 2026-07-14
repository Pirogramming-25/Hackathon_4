FROM python:3.12

WORKDIR /app

# MySQL 드라이버(mysqlclient) 설치에 필요한 리눅스 패키지
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    pkg-config \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 레이어 캐싱을 위해 requirements 먼저 복사
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD python manage.py collectstatic --noinput && \
    python manage.py migrate --noinput && \
    python manage.py runserver 0.0.0.0:8000