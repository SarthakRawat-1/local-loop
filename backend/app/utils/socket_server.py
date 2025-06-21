import socketio
from fastapi import FastAPI
from datetime import datetime

sio = socketio.AsyncServer(cors_allowed_origins="*")
app = FastAPI()
sio_app = socketio.ASGIApp(sio, other_asgi_app=app)

connections = {}
messages = {}
time_online = {}

@sio.event
async def connect(sid, environ):
    print(f"New client connected: {sid}")

@sio.on("join-call")
async def join_call(sid, path):
    if path not in connections:
        connections[path] = []
    connections[path].append(sid)
    time_online[sid] = datetime.utcnow()

    for user_sid in connections[path]:
        await sio.emit("user-joined", (sid, connections[path]), to=user_sid)

    if path in messages:
        for msg in messages[path]:
            await sio.emit("chat-message", msg["data"], to=sid)

@sio.on("signal")
async def signal(sid, to_id, message):
    await sio.emit("signal", (sid, message), to=to_id)

@sio.on("chat-message")
async def chat_message(sid, data, sender):
    matching_room = None

    for room_key, users in connections.items():
        if sid in users:
            matching_room = room_key
            break

    if matching_room:
        if matching_room not in messages:
            messages[matching_room] = []

        messages[matching_room].append({
            "sender": sender,
            "data": data,
            "socket-id-sender": sid
        })

        print(f"message {matching_room}: {sender}: {data}")
        for user_sid in connections[matching_room]:
            await sio.emit("chat-message", (data, sender, sid), to=user_sid)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    diff_time = abs((datetime.utcnow() - time_online.get(sid, datetime.utcnow())).total_seconds())

    for path, user_list in list(connections.items()):
        if sid in user_list:
            for user_sid in user_list:
                if user_sid != sid:
                    await sio.emit("user-left", sid, to=user_sid)

            connections[path] = [uid for uid in user_list if uid != sid]
            if not connections[path]:
                del connections[path]
