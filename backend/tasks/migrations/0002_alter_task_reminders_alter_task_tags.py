# Generated by Django 4.2.6 on 2023-10-29 11:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='reminders',
            field=models.ManyToManyField(blank=True, to='tasks.reminder'),
        ),
        migrations.AlterField(
            model_name='task',
            name='tags',
            field=models.ManyToManyField(blank=True, to='tasks.tag'),
        ),
    ]
