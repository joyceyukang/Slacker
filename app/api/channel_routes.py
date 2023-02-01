from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Channel, User
from ..forms import ChannelForm
from ..models.db import db

channel_routes = Blueprint('channel', __name__)

# GET ALL CHANNELS


@channel_routes.route('/', methods=['GET'])
@login_required
def all_channels():
    channels = Channel.query.all()
    # print('HELLO-----------', channels)
    return {"channels": [channel.to_dict() for channel in channels]}

# GET SINGLE CHANNEL


@channel_routes.route('/<int:id>', methods=['GET'])
@login_required
def single_channel(id):
    channel = Channel.query.get(id)
    return channel.to_dict()

# CREATE


@channel_routes.route('/new', methods=['POST'])
@login_required
def create_channel():
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        current = current_user.to_dict()
        user = User.query.get(current['id'])
        
        new_channel = Channel()
        form.populate_obj(new_channel)
        new_channel.owner_id = current_user.id


        db.session.add(new_channel)
        db.session.commit()
        
        user.channels_joined.append(new_channel)
        db.session.add(user)
        db.session.commit()

        return new_channel.to_dict(), 201

    if form.errors:
        return {
            "errors": form.errors
        }, 400

# UPDATE


@channel_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_channel_by_id(id):
    current_channel = Channel.query.get(id)

    if not current_channel:
        return {"errors": "Channel not found"}, 404

    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        form.populate_obj(current_channel)

        db.session.add(current_channel)
        db.session.commit()
        return current_channel.to_dict(), 201

    if form.errors:
        return {
            "errors": form.errors
        }, 400

# DELETE


@channel_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_channel(id):
    current_channel = Channel.query.get(id)
    db.session.delete(current_channel)
    db.session.commit()

    if not current_channel:
        return {"errors": "Channel not found"}, 404

    return {"message": "Channel deleted"}
