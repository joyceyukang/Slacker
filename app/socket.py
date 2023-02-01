from flask_socketio import SocketIO, emit, send, join_room, leave_room
import os

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://slacker.onrender.com"
    ]
else:
    origins = "*"

# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)

# join room
@socketio.on("join")
def join(channelId):
    join_room(channelId)
    send(' you have entered the room.', to=channelId)

@socketio.on("chat")
def handle_chat(data):
    channelId = data["channelId"]
    join_room(channelId)
    emit("chat", data, room=channelId)

@socketio.on("leave")
def leave(channelId):
    leave_room(channelId)
