# Generated by Django 4.2.6 on 2023-11-13 18:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tasks', '0011_recurrencetask'),
    ]

    operations = [
        migrations.CreateModel(
            name='Habit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('notes', models.TextField(default='')),
                ('importance', models.PositiveSmallIntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=1)),
                ('difficulty', models.PositiveSmallIntegerField(choices=[(1, 'Easy'), (2, 'Normal'), (3, 'Hard'), (4, 'Very Hard'), (5, 'Devil')], default=1)),
                ('challenge', models.BooleanField(default=False)),
                ('fromSystem', models.BooleanField(default=False)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('google_calendar_id', models.CharField(blank=True, max_length=255, null=True)),
                ('start_event', models.DateTimeField(null=True)),
                ('end_event', models.DateTimeField(null=True)),
                ('streak', models.IntegerField(default=0)),
                ('tags', models.ManyToManyField(blank=True, to='tasks.tag')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
