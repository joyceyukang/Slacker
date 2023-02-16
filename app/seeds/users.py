from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo1 = User(
        username='Demo1', email='demo1@aa.io', password='password')
    demo2 = User(
        username='Demo2', email='demo2@aa.io', password='password')
    bobbie = User(
        username='bobbie', email='bobbie@aa.io', password='password')
    harry = User(
        username='potter', email='potter@aa.io', password='password')
    cedric = User(
        username='diggz', email='diggz@aa.io', password='password')
    luna = User(
        username='lovegood', email='lovegood@aa.io', password='password')
    malfoy = User(
        username='draco', email='draco@aa.io', password='password')
    joyce = User(
        username='muggle', email='muggle@aa.io', password='password')

    all_users = [demo1, demo2, bobbie, harry, cedric, luna, malfoy, joyce]

    for user in all_users:
        db.session.add(user)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM users")
        
    db.session.commit()