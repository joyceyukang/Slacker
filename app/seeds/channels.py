from app.models import db, Channel, environment, SCHEMA

def seed_channels():
    slackerCentral = Channel(
        owner_id=3, name='Slackers-central', description='A chat for all members of Slacker.')
    inspiration = Channel(
        owner_id=4, name='Inspirational-quotes', description='Need some inspiration? We can help!')
    scheduler = Channel(
        owner_id=5, name='Schedules Galore', description='Have too many tasks? Slacking on those tasks? We can make a schedule for you.')
    tips = Channel(
        owner_id=6, name='Tips', description='Some neat tips and tricks to not be a slacker!'
    )
    distraction = Channel(
        owner_id=7, name='Distractions', description="When you don't want to do anything we talk about everything!"
    )
    furniture = Channel(
        owner_id=8, name='Lazy Furniture', description="We talk about the up to date recs for the best furniture to relax on when you feel like slacking!!"
    )
    
    all_channels = [slackerCentral, inspiration, scheduler, tips, distraction, furniture]

    for channel in all_channels:
        db.session.add(channel)
    db.session.commit()



# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM channels")
        
    db.session.commit()