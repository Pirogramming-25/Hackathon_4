from django.db import models


class Course(models.Model):
    """학습 코스 (예: 스마트폰 기초, 인터넷 기초)"""

    slug = models.CharField('식별자', max_length=50, unique=True)
    emoji = models.CharField('이모지', max_length=8)
    name = models.CharField('이름', max_length=50)
    description = models.CharField('설명', max_length=200)
    order = models.IntegerField('정렬 순서', default=0)

    class Meta:
        verbose_name = '코스'
        verbose_name_plural = '코스'
        ordering = ['order']

    def __str__(self):
        return f'{self.emoji} {self.name}'


class Chapter(models.Model):
    """코스에 속한 챕터 (예: 전화, 와이파이 연결)"""

    course = models.ForeignKey(
        Course, verbose_name='코스', on_delete=models.CASCADE, related_name='chapters'
    )
    slug = models.CharField('식별자', max_length=50, unique=True)
    emoji = models.CharField('이모지', max_length=8)
    name = models.CharField('이름', max_length=50)
    goal = models.CharField('학습 목표', max_length=200)
    minutes = models.IntegerField('예상 소요 시간(분)', default=5)
    order = models.IntegerField('정렬 순서', default=0)

    class Meta:
        verbose_name = '챕터'
        verbose_name_plural = '챕터'
        ordering = ['course', 'order']

    def __str__(self):
        return f'{self.emoji} {self.name}'


class Step(models.Model):
    """챕터 안의 실습 단계. html에는 정답 위치를 [data-tap="correct"]로 표시한다."""

    chapter = models.ForeignKey(
        Chapter, verbose_name='챕터', on_delete=models.CASCADE, related_name='steps'
    )
    order = models.IntegerField('단계 순서')
    instruction = models.CharField('안내 문구', max_length=200)
    html = models.TextField('폰 화면 마크업')

    class Meta:
        verbose_name = '스텝'
        verbose_name_plural = '스텝'
        ordering = ['chapter', 'order']
        unique_together = [['chapter', 'order']]

    def __str__(self):
        return f'{self.chapter.name} {self.order + 1}단계'


class Progress(models.Model):
    """세션 기반 진도. 로그인이 없으므로 Django 세션 키로 사용자를 식별한다."""

    session_key = models.CharField('세션 키', max_length=40, db_index=True)
    chapter = models.ForeignKey(
        Chapter, verbose_name='챕터', on_delete=models.CASCADE, related_name='progresses'
    )
    last_step = models.IntegerField('마지막으로 본 단계', default=0)
    is_completed = models.BooleanField('완료 여부', default=False)
    updated_at = models.DateTimeField('갱신 시각', auto_now=True)

    class Meta:
        verbose_name = '진도'
        verbose_name_plural = '진도'
        ordering = ['-updated_at']
        unique_together = [['session_key', 'chapter']]

    def __str__(self):
        state = '완료' if self.is_completed else f'{self.last_step + 1}단계'
        return f'{self.chapter.name} — {state}'
