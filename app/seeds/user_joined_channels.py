from app.models import db, User, Channel, environment, SCHEMA
from app.models.user_joined_channels import joined_channels
import random


def seed_join_table():
    users = User.query.all()
    channels = Channel.query.all()

    # def randomChannel():
    #     return channels[random.randint(0, len(channels)-1)]

    # for user in users:
    #     channel = randomChannel()

    #     user.user_channels.append(channel)

    #     db.session.add(user)
    #     db.session.commit()

    users[0].user_channels.append(channels[5])
    users[1].user_channels.append(channels[4])
    users[2].user_channels.append(channels[5])
    users[3].user_channels.append(channels[4])
    users[4].user_channels.append(channels[3])
    users[5].user_channels.append(channels[2])
    users[6].user_channels.append(channels[1])
    users[7].user_channels.append(channels[0])

    for user in users: 
        db.session.add(user)
        db.session.commit()


def undo_join_table():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.joined_channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM joined_channels")

    db.session.commit()
