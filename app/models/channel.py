from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user_joined_channels import joined_channels


class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())

    # Many to one: Many channels belong to a user
    user = db.relationship('User', back_populates='channels')

    # join table for channels that the user joined
    channels_joined = db.relationship("User",
                                secondary=joined_channels,
                                back_populates='user_channels')

    def to_dict(self):
        """
        Returns a dict representing Channel
        {
            id,
            owner_id,
            name,
            description,
            users_joined
        }
        """
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "name": self.name,
            "description": self.description,
            "users_joined": len(self.channels_joined)
        }
