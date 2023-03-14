from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Reply(db.Model):
    __tablename__ = 'replies'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")), nullable=False)
    input = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())

    # Many to one: Many replies belong to a user
    user = db.relationship('User', back_populates='replies')
    # Many to one: Many replies belong to a message
    messages = db.relationship('Message', back_populates='replies')

    def to_dict(self):
        """
        Returns a dict representing Message
        {
            id,
            owner_id,
            message_id
            input,
        }
        """
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "message_id": self.message_id,
            "input": self.input,
            "user": self.user.to_dict()
        }
