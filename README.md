# Hackathon_4

4조 해커톤 레포지토리

# 스마트 한걸음 👆

> 설명서 대신 연습장. 스마트폰을 직접 눌러보며 내 속도대로 배우는 곳.

스마트폰·인터넷 기본 기능을 **읽는 설명서가 아니라 직접 눌러보는 연습장**으로 배우는
진도 관리형 학습 웹 서비스입니다. 코스 → 챕터 → 스텝으로 잘게 쪼갠 학습 단위를
사용자가 자기 속도대로 체크하며 완주합니다.

제25기 피로그래밍 해커톤 **4조** 프로젝트입니다.

# 배포 주소

```
https://smart-hangeoleum.duckdns.org/
```

---

## 🎯 문제 정의

고령층의 디지털 격차는 **"기기가 없어서"가 아니라 "쓸 줄 몰라서"** 생깁니다.
스마트폰 보유율은 높지만(노인 76.6%) 활용 역량은 낮아, 접근이 아닌 **역량**에서 격차가 집중됩니다.

| 구분                     | 수치                  |
| ------------------------ | --------------------- |
| 고령층 디지털정보화 수준 | 71.4% (가장 낮음)     |
| 접근 수준                | 96.5%                 |
| 활용 수준                | 80.0%                 |
| **역량 수준**            | **65.6% (격차 집중)** |

기존 학습 경로의 한계:

- 가족에게 물어보기 → 반복 질문에 위축, 관계 소모
- 복지관 단체교육 → 개인 속도 반영·복습 불가
- 유튜브/문서 → 눈으로 보지만 손이 기억하지 못함, 진도 기록 없음

> 출처: 과학기술정보통신부·한국지능정보사회진흥원 「2024 디지털정보격차 실태조사」,
> 보건복지부 「2023년 노인실태조사」

---

## 👥 대상 이용자

65세 이상 고령층 중 **스마트폰은 보유했으나 전화 수신·발신 등 최소 기능만 사용하며,
배우려는 의지는 있으나 물어볼 곳이 마땅치 않은** 사용자.

---

## ✨ 핵심 기능

| 기능                    | 대상   | 설명                                      |
| ----------------------- | ------ | ----------------------------------------- |
| 코스 목록               | 사용자 | 카드형 UI + 코스별 완료율 프로그레스 바   |
| 챕터 학습 화면          | 사용자 | 스텝 체크리스트, 올바른 위치 클릭 시 체크 |
| 진도 저장 · 이어서 하기 | 사용자 | 서버에 진도 저장, 재접속 시 상태 복원     |
| 접근성 컨트롤           | 사용자 | 큰 글씨, 고대비 모드, 큰 버튼             |
| 콘텐츠 관리             | 관리자 | Django Admin으로 코스/챕터/스텝 추가·관리 |
| (확장) 보호자 대시보드  | 보호자 | 진도 현황 및 막힌 지점 확인               |

---

## 📚 학습 구조

콘텐츠는 **코스 → 챕터 → 스텝** 3단 구조이며, 관리자가 Django Admin에서 자유롭게 추가할 수 있습니다.

```
📱 스마트폰 기초 코스
├─ 📞 전화 챕터
├─ 👤 연락처 추가 챕터
├─ 💬 문자 보내기 챕터   (기초: 문자 보내기 / 추가: 사진 첨부)
└─ 📷 사진 챕터

🌐 인터넷 기초 코스
├─ 📶 와이파이 연결 챕터
└─ 🔍 인터넷 검색 챕터   (기초: 검색하기 / 추가: 사이트 접속·이전 화면)
```

> 키오스크·정부24·카카오톡·금융앱 등도 **동일한 구조로 콘텐츠만 추가**하면 확장됩니다.

> 📄 데이터 모델 설계는 [`docs/ERD.md`](./docs/ERD.md), API 명세는 [`docs/API.md`](./docs/API.md) 참고.

---

## 🛠️ 기술 스택

| 구분     | 기술                    |
| -------- | ----------------------- |
| Backend  | Django                  |
| Frontend | HTML · CSS · Vanilla JS |
| Database | MySQL                   |
| 배포     | Docker · AWS EC2        |

**저장 방식:** 로그인 없이 **세션 기반**으로 진도를 서버 DB에 저장하여 회원가입 장벽을 없앴습니다.
(추후 로그인 기반으로 확장하여 기기 변경 시에도 이어보기 및 보호자 계정 연동 가능)

---

## 📁 프로젝트 구조

```
Hackathon_4/
├── config/                      # Django 프로젝트 설정
│   ├── settings.py              #   환경변수·DB·정적파일 설정
│   ├── urls.py                  #   전체 URL 라우팅 (페이지 + API)
│   └── wsgi.py / asgi.py
├── smartstep/                   # 학습 도메인 앱
│   ├── migrations/              #   DB 마이그레이션 (초기 코스/챕터/스텝 시드 포함)
│   ├── fixtures/steps.json      #   스텝 시드 데이터 (마이그레이션에서 읽어옴)
│   ├── models.py                #   코스 · 챕터 · 스텝 · 진도 모델
│   ├── views.py                 #   API 로직 (진도 저장 등)
│   ├── urls.py                  #   API 라우팅
│   └── admin.py                 #   콘텐츠 관리 (Django Admin)
├── templates/                   # 프론트 화면
│   ├── assets/                  #   CSS · JS
│   ├── index.html               #   메인
│   ├── courses.html             #   코스 목록
│   ├── course.html              #   코스 상세
│   ├── learn.html               #   실습 화면
│   └── complete.html            #   완료 화면
├── docs/                        # 설계 문서
│   ├── ERD.md                   #   데이터 모델 설계
│   └── API.md                   #   API 명세
├── media/                       # 업로드 파일용 볼륨 (현재 미사용, 추후 확장 대비 예약)
├── .github/
│   ├── workflows/deploy.yml     #   CI/CD (GitHub Actions 자동 배포)
│   └── pull_request_template.md
├── Dockerfile                   # Django 이미지 빌드 설정
├── docker-compose.yml           # MySQL + Django 컨테이너 정의
├── docker-compose.override.yml  # 로컬 개발용 소스 마운트 (EC2엔 두지 않음)
├── .dockerignore
├── .env                         # 환경변수 (git 미포함, 각자 생성)
├── manage.py
├── requirements.txt             # 의존성 목록
├── CONTRIBUTING.md              # 협업 가이드
└── README.md
```

---

## 🚀 로컬 실행 방법

> 이 프로젝트는 **MySQL + Docker** 환경입니다.
> 로컬에 MySQL을 직접 설치할 필요 없이 Docker로 실행합니다.
> **Docker Desktop이 켜져 있어야 합니다.**

```bash
# 1. 저장소 클론
git clone https://github.com/Pirogramming-25/Hackathon_4.git
cd Hackathon_4

# 2. .env 파일 생성
#    최상위 폴더에 .env 파일을 만들고, 팀에서 공유한 값을 넣습니다.
#    (.env는 git에 올라가지 않으므로 각자 생성해야 합니다)

# 3. Docker로 실행 (MySQL + Django 컨테이너가 함께 실행됩니다)
docker compose up --build
```

실행 후 브라우저에서 http://localhost:8000 접속

```bash
# 종료: Ctrl + C
# 컨테이너 정리:
docker compose down
```

> ⚠️ `python manage.py migrate`를 로컬에서 직접 실행하지 마세요.
> 우리 프로젝트의 DB(MySQL)는 Docker 컨테이너 안에서 동작하며,
> 마이그레이션은 컨테이너 실행 시 자동으로 처리됩니다.
> 이때 코스·챕터·스텝 초기 콘텐츠도 데이터 마이그레이션(`0002_seed_content.py`,
> `0003_seed_steps.py` + `fixtures/steps.json`)으로 함께 자동 생성됩니다.

### Django Admin 접속 (콘텐츠 관리)

관리자 계정이 없다면 컨테이너 안에서 아래 명령으로 생성합니다.

```bash
docker compose exec web python manage.py createsuperuser
```

이후 http://localhost:8000/admin 에서 코스·챕터·스텝을 추가·수정할 수 있습니다.

---

## 🔄 배포 (CI/CD)

`develop` 브랜치에 merge되면 GitHub Actions가 자동으로
이미지를 빌드하여 Docker Hub에 push하고, EC2에 배포합니다.
배포 현황은 저장소의 **Actions 탭**에서 확인할 수 있습니다.

---

## ⚠️ 배포 시 주의사항

`docker-compose.override.yml`은 **로컬 개발 전용**입니다 (소스 코드 마운트).
Docker Compose가 자동으로 읽는 파일이라, **EC2 배포 서버에는 절대 두면 안 됩니다.**
EC2에 이 파일이 있으면 소스 폴더 자리에 빈 폴더가 마운트되어 앱이 죽습니다.

- 로컬: `docker compose up` (override 자동 적용, 소스 마운트됨)
- EC2: `docker-compose.yml`과 `.env`만 두고 실행 (override 파일 없음)

---

## 🌿 브랜치 전략

`main`(배포) · `develop`(개발 통합) · `feature/*`(기능별 작업) 구조입니다.
자세한 브랜치·PR·커밋 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md) 참고.

---

## 👨‍👩‍👧‍👦 팀원 및 역할

| 이름   | 역할                   |
| ------ | ---------------------- |
| 문예지 | 프론트엔드 · 발표 자료 |
| 이지연 | 백엔드                 |
| 정현민 | 프론트엔드 · 백엔드    |
| 강성훈 | 백엔드 · 배포          |
