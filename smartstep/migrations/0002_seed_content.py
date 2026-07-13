from django.db import migrations

# 프론트의 assets/js/courses.js와 동일한 내용. 팀원 누구나 컨테이너를 띄우면
# 같은 코스/챕터를 갖도록 데이터 마이그레이션으로 넣는다.
COURSES = [
    {
        'slug': 'smartphone',
        'emoji': '📱',
        'name': '스마트폰 기초',
        'description': '전화, 문자, 사진까지 스마트폰의 기본을 하나씩 배워요.',
        'chapters': [
            ('call', '📞', '전화', '전화를 걸고 끊는 방법을 배워요.', 5),
            ('contacts', '👤', '연락처 추가', '가족과 친구의 번호를 저장해요.', 5),
            ('message', '💬', '문자 보내기', '안부 문자를 직접 보내봐요.', 7),
            ('photo', '📷', '사진', '사진을 찍고 확인하는 방법을 배워요.', 5),
        ],
    },
    {
        'slug': 'internet',
        'emoji': '🌐',
        'name': '인터넷 기초',
        'description': '와이파이 연결부터 궁금한 것 검색까지 배워요.',
        'chapters': [
            ('wifi', '📶', '와이파이 연결', '집에서 와이파이를 직접 연결해요.', 6),
            ('search', '🔍', '인터넷 검색', '오늘 날씨를 직접 검색해봐요.', 6),
        ],
    },
]


def seed(apps, schema_editor):
    Course = apps.get_model('smartstep', 'Course')
    Chapter = apps.get_model('smartstep', 'Chapter')

    for course_order, data in enumerate(COURSES):
        course, _ = Course.objects.update_or_create(
            slug=data['slug'],
            defaults={
                'emoji': data['emoji'],
                'name': data['name'],
                'description': data['description'],
                'order': course_order,
            },
        )
        for order, (slug, emoji, name, goal, minutes) in enumerate(data['chapters']):
            Chapter.objects.update_or_create(
                slug=slug,
                defaults={
                    'course': course,
                    'emoji': emoji,
                    'name': name,
                    'goal': goal,
                    'minutes': minutes,
                    'order': order,
                },
            )


def unseed(apps, schema_editor):
    Course = apps.get_model('smartstep', 'Course')
    Course.objects.filter(slug__in=[c['slug'] for c in COURSES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('smartstep', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
