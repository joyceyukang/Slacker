from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Channel
from ..models.db import db

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/join', methods=['POST'])
@login_required
def user_join_channel(id):
    """
    Adds channels to user joins table to join channels
    """
    current = current_user.to_dict()
    user = User.query.get(current['id'])
    channel = Channel.query.get(id)

    if not channel:
        return {"errors": "Channel not found"}, 404

    user.user_channels.append(channel)
    db.session.add(user)
    db.session.commit()

    return {"message": "Channel joined"}

@user_routes.route('/<int:id>/join', methods=['DELETE'])
@login_required
def delete_favorite(id):
    """
    Delete the channel from user_channels if they decide to unfavorite it
    """
    current = current_user.to_dict()
    user = User.query.get(current['id'])

    if len(user.user_channels):
        for i in range(len(user.user_channels)):
            if user.user_channels[i].id == id:
                user.user_channels.pop(i)

                db.session.add(user)
                db.session.commit()

                return {'message': 'deleted joined channel'}
                
    return {"errors": "Channel not found"}, 404