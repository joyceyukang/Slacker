from app.models import db, Message, environment, SCHEMA


def seed_messages():
    message1 = Message(
        owner_id=3, channel_id=6,  input='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus, nisl vel lacinia molestie, mauris metus iaculis ligula, vel viverra orci lacus sed massa. ')
    message2 = Message(
        owner_id=4, channel_id=2,  input='Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent ultricies leo ultrices sem euismod maximus.')
    message3 = Message(
        owner_id=5, channel_id=2, input='Mauris a mi fringilla, pellentesque leo eget, convallis libero. Phasellus ligula purus, volutpat non nulla nec, euismod laoreet arcu.')
    message4 = Message(
        owner_id=6, channel_id=3, input='Ut eget neque eget diam hendrerit interdum. Suspendisse fermentum, mauris a facilisis blandit, mauris ante consectetur massa, a semper magna lectus et nisl. Morbi vitae ultrices orci. Phasellus ornare blandit ultrices. Donec non nunc porta, tincidunt sapien nec, pulvinar libero. Nullam vulputate, sapien a consectetur sodales, elit ipsum placerat purus, dictum facilisis leo ligula et velit.'
    )
    message5 = Message(
        owner_id=7, channel_id=4, input="Nulla sodales quam vitae finibus tristique. Fusce luctus massa eget fringilla blandit. Nulla vitae orci a nulla elementum bibendum et in urna."
    )
    message6 = Message(
        owner_id=8, channel_id=1, input="Nulla quis erat in diam pulvinar suscipit eget sit amet diam. Duis cursus magna in nunc cursus, sed consequat massa accumsan. Aenean urna lectus, luctus in leo et, maximus convallis ipsum. Integer id justo sodales, auctor orci ac, bibendum nibh."
    )
    message7 = Message(
        owner_id=1, channel_id=2, input="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus, nisl vel lacinia molestie, mauris metus iaculis ligula, vel viverra orci lacus sed massa."
    )
    message8 = Message(
        owner_id=2, channel_id=3, input="Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent ultricies leo ultrices sem euismod maximus."
    )
    message9 = Message(
        owner_id=3, channel_id=4, input="Mauris a mi fringilla, pellentesque leo eget, convallis libero. Phasellus ligula purus, volutpat non nulla nec, euismod laoreet arcu."
    )
    message10 = Message(
        owner_id=4, channel_id=5, input="Ut eget neque eget diam hendrerit interdum. Suspendisse fermentum, mauris a facilisis blandit, mauris ante consectetur massa, a semper magna lectus et nisl. Morbi vitae ultrices orci. Phasellus ornare blandit ultrices."
    )
    message11 = Message(
        owner_id=5, channel_id=6, input="Nulla quis erat in diam pulvinar suscipit eget sit amet diam. Duis cursus magna in nunc cursus, sed consequat massa accumsan. Aenean urna lectus, luctus in leo et, maximus convallis ipsum. Integer id justo sodales, auctor orci ac, bibendum nibh."
    )
    message12 = Message(
        owner_id=6, channel_id=6, input="Ut eget neque eget diam hendrerit interdum. Suspendisse fermentum, mauris a facilisis blandit, mauris ante consectetur massa, a semper magna lectus et nisl. Morbi vitae ultrices orci. Phasellus ornare blandit ultrices. Donec non nunc porta, tincidunt sapien nec, pulvinar libero. Nullam vulputate, sapien a consectetur sodales, elit ipsum placerat purus, dictum facilisis leo ligula et velit."
    )

    all_input = [message1, message2, message3, message4, message5, message6, message7, message8, message9, message10, message11, message12]

    for input in all_input:
        db.session.add(input)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM messages")

    db.session.commit()
