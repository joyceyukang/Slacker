from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Message, Channel
from ..forms import MessageForm
from ..models.db import db

message_routes = Blueprint('message', __name__)

# GET ALL MESSAGES
@message_routes.route('/', methods=['GET'])
@login_required
def all_messages():
    messages = Message.query.all()
    return {"messages": [message.to_dict() for message in messages]}

# GET MESSAGE BY CHANNEL ID
@message_routes.route('/<int:channelId>/messages')
@login_required
def channel_messages(channelId):
    channel = Channel.query.get(channelId)

    if not channel:
        return {"errors": "Channel not found"}, 404
    all_channel_messages = Message.query.filter(
        Message.channel_id == channelId).all()

    return {"channelMessages": [message.to_dict() for message in all_channel_messages]}


# GET SINGLE MESSAGE
@message_routes.route('/<int:id>', methods=['GET'])
@login_required
def single_message(id):
    message = Message.query.get(id)
    return message.to_dict()

# CREATE MESSAGE
@message_routes.route('/new', methods=['POST'])
@login_required
def create_message():
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        channelId = form.data['channel_id']
        channel = Channel.query.get(channelId)

        if not channel:
            return {"errors": "Channel not found"}, 404

        new_message = Message()
        form.populate_obj(new_message)

        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict(), 201

    if form.errors:
        return {
             "errors": form.errors
        }, 400

# UPDATE MESSAGE
@message_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_message_by_id(id):
    current_message = Message.query.get(id)
    if not current_message:
        return {"errors": "Message not found"}, 404

    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        channelId = form.data['channel_id']
        channel = Channel.query.get(channelId)

        if not channel:
            return {"errors": "Channel not found"}, 404

        form.populate_obj(current_message)

        db.session.add(current_message)
        db.session.commit()
        return current_message.to_dict(), 201

    if form.errors:
        return {
            "errors": form.errors
        }, 400

# DELETE MESSAGES
@message_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_message(id):
    current_message = Message.query.get(id)

    if not current_message:
        return {"errors": "Message not found"}, 404
    
    if not current_message.owner_id == current_user.id:
        return {"error": "Not authorized to delete message"}, 401

    db.session.delete(current_message)
    db.session.commit()
    

    return {"message": "Message deleted"}