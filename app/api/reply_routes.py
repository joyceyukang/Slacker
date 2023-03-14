from flask import Blueprint, request
from flask_login import login_required, current_user
from ..models import Message, Reply
from ..forms import ReplyForm
from ..models.db import db

reply_routes = Blueprint('reply', __name__)

# GET ALL REPLIES
@reply_routes.route('/', methods=['GET'])
@login_required
def all_replies():
    replies = Reply.query.all()
    return {"replies": [reply.to_dict() for reply in replies]}

# GET REPLIES BY MESSAGE ID
@reply_routes.route('/<int:messageId>/replies')
@login_required
def message_replies(messageId):
    message = Message.query.get(messageId)

    if not message:
        return {"errors": "Message not found"}, 404
    all_message_replies = Reply.query.filter(
       Reply.message_id == messageId).all()

    return {"messageReplies": [reply.to_dict() for reply in all_message_replies]}


# GET SINGLE REPLY
@reply_routes.route('/<int:id>', methods=['GET'])
@login_required
def single_reply(id):
    reply = Reply.query.get(id)
    return reply.to_dict()

# CREATE REPLY
@reply_routes.route('/new', methods=['POST'])
@login_required
def create_reply():
    form = ReplyForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        messageId = form.data['message_id']
        message = Message.query.get(messageId)

        if not message:
            return {"errors": "Message not found"}, 404

        new_reply = Reply()
        form.populate_obj(new_reply)

        db.session.add(new_reply)
        db.session.commit()
        return new_reply.to_dict(), 201

    if form.errors:
        return {
             "errors": form.errors
        }, 400

# UPDATE REPLY
@reply_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_message_by_id(id):
    current_reply = Reply.query.get(id)
    if not current_reply:
        return {"errors": "Reply not found"}, 404

    form = ReplyForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        messageId = form.data['message_id']
        message = Message.query.get(messageId)

        if not message:
            return {"errors": "Message not found"}, 404

        form.populate_obj(current_reply)

        db.session.add(current_reply)
        db.session.commit()
        return current_reply.to_dict(), 201

    if form.errors:
        return {
            "errors": form.errors
        }, 400

# DELETE REPLY
@reply_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_reply(id):
    current_reply = Reply.query.get(id)

    if not current_reply:
        return {"errors": "Reply not found"}, 404
    
    if not current_reply.owner_id == current_user.id:
        return {"error": "Not authorized to delete reply"}, 401

    db.session.delete(current_reply)
    db.session.commit()
    

    return {"message": "Reply deleted"}