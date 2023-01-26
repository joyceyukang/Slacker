from app.models import db, User, Channel, environment, SCHEMA
from app.models.user_joined_channels import joined_channels
import random


def seed_join_table():
    users = User.query.all()
    channels = Channel.query.all()

    def randomChannel():
        return channels[random.randint(0, len(channels))]

    for user in users:
        channel = randomChannel()

        user.user_channels.append(channel)

        db.session.add(user)
        #  print(user.user_businesses)
        db.session.commit()


def undo_join_table():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.joined_channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM joined_channels")

    db.session.commit()
