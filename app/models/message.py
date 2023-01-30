from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("channels.id")), nullable=False)
    message = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())

    # Many to one: Many messages belong to a user
    user = db.relationship('User', back_populates='messages')
    # Many to one: Many messages belong to a channel
    channels = db.relationship('Channel', back_populates='messages')

    def to_dict(self):
        """
        Returns a dict representing Message
        {
            id,
            owner_id,
            channel_id
            message,
        }
        """
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "channel_id": self.channel_id,
            "message": self.message
        }
