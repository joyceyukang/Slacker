from app.models import db, Channel, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_channels():
    hogwarts = Channel(
        owner_id=3, name='Hogwarts-central', description='A chat for all members of Hogwarts.')
    gryffindor = Channel(
        owner_id=4, name='Gryffindor', description='The best house')
    hufflepuff = Channel(
        owner_id=5, name='Hufflepuff', description='Integrity is the name of the game.')
    ravenclaw = Channel(
        owner_id=6, name='Ravenclaw', description='The smartest crowd.'
    )
    slytherin = Channel(
        owner_id=7, name='Slytherin', description="We're going to take over hogwarts."
    )
    muggles = Channel(
        owner_id=8, name='Muggles', description="Muggles unite!"
    )
    
    all_channels = [hogwarts, gryffindor, hufflepuff, ravenclaw, slytherin, muggles]

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