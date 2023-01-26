from .db import add_prefix_for_prod, db, environment, SCHEMA
from sqlalchemy.sql import func

joined_channels = db.Table(
    "joined_channels",
    db.Model.metadata,
    db.Column("user_id", db.ForeignKey(
        add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("channel_id", db.ForeignKey(
        add_prefix_for_prod("channels.id")), primary_key=True),
    db.Column("created_at", db.DateTime(timezone=True), default=func.now())
)

if environment == "production":
    joined_channels.schema = SCHEMA