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
    print(channelId)
    join_room(channelId)
    socketio.emit(' you have entered the room.', to=channelId)
    print("joined")

@socketio.on("chat")
def handle_chat(data):
    channelId = data["channelId"]
    join_room(channelId)
    print("chat sent")
    socketio.emit("chat", data, room=channelId)

@socketio.on("leave")
def leave(channelId):
    print("left")
    leave_room(channelId)
