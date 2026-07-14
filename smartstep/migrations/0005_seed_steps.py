import json
from pathlib import Path

from django.db import migrations

# 0003/0004와 동일한 패턴. 연락처 챕터 1단계(홈 화면) 마크업을 hackertone-ui 기반
# Device Frame 디자인(그라데이션 배경 + 하단 앱 아이콘 4개)으로 교체하기 위해
# fixtures/steps.json을 다시 읽어 update_or_create 한다.
FIXTURE = Path(__file__).resolve().parent.parent / 'fixtures' / 'steps.json'


def reseed(apps, schema_editor):
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


def noop(apps, schema_editor):
    # 되돌려도 데이터를 지우지 않는다 (이전 스텝이 남아있어야 하므로).
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('smartstep', '0004_seed_steps'),
    ]

    operations = [
        migrations.RunPython(reseed, noop),
    ]
