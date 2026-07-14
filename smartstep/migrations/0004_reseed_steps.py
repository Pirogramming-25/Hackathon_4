import json
from pathlib import Path

from django.db import migrations

# 0003과 동일하게 fixtures/steps.json을 읽어 스텝을 갱신한다.
# 프론트 전화 UI 실사화로 steps.json 내용이 바뀌었으나, 0003은 이미 적용되어
# 재실행되지 않으므로 새 마이그레이션으로 update_or_create를 다시 태운다.
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
    # 되돌려도 데이터를 지우지 않는다 (0003의 스텝이 남아있어야 하므로).
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('smartstep', '0003_seed_steps'),
    ]

    operations = [
        migrations.RunPython(reseed, noop),
    ]