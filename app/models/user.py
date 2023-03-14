from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_joined_channels import joined_channels


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    # One to many: User has many channels
    channels = db.relationship('Channel', back_populates='user', cascade='all, delete-orphan')
    #  One to many: User has many messages
    messages = db.relationship('Message', back_populates='user', cascade='all, delete-orphan')
    #  One to many: User has many replies
    replies = db.relationship('Reply', back_populates='user', cascade='all, delete-orphan')


    # join table for channels that the user joined
    user_channels = db.relationship("Channel",
                                secondary= joined_channels,
                                back_populates='channels_joined')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        '''
        Returns a dict representing User
        {
            id,
            username,
            email,
            channels_joined,
        }
        '''
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'channels_joined': [channel.to_dict() for channel in self.user_channels],
        }
