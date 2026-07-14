import json
from pathlib import Path

from django.db import migrations

# 스텝 HTML은 프론트 lessons.js가 헬퍼 함수로 조립하던 것을 그대로 렌더해 뽑은 결과다.
# (fixtures/steps.json — 챕터 slug → 스텝 목록)
FIXTURE = Path(__file__).resolve().parent.parent / 'fixtures' / 'steps.json'


def seed(apps, schema_editor):
    Chapter = apps.get_model('smartstep', 'Chapter')
    Step = apps.get_model('smartstep', 'Step')

    data = json.loads(FIXTURE.read_text(encoding='utf-8'))

    for chapter_slug, steps in data.items():
        try:
            chapter = Chapter.objects.get(slug=chapter_slug)
        except Chapter.DoesNotExist:
            continue

        for step in steps:
            Step.objects.update_or_create(
                chapter=chapter,
                order=step['order'],
                defaults={
                    'instruction': step['instruction'],
                    'html': step['html'],
                },
            )


def unseed(apps, schema_editor):
    Step = apps.get_model('smartstep', 'Step')
    Step.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('smartstep', '0002_seed_content'),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
