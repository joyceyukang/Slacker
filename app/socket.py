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
def join(channel_id):
    print(channel_id)
    join_room(channel_id)
    socketio.emit(' you have entered the room.', to=channel_id)
    # print("joined")

@socketio.on("chat")
def handle_chat(data):
    # print("HELLO", data)
    channel_id = data["channel_id"]
    join_room(channel_id)
    # print("chat sent")
    socketio.emit("chat", data, room=channel_id)

@socketio.on("leave")
def leave(channel_id):
    # print("left")
    leave_room(channel_id)
