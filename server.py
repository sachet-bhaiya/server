import asyncio
import os
import websockets

connected_clients = set()

async def handler(websocket, path):
    connected_clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")
    
    try:
        async for message in websocket:
            print(f"Received message from {websocket.remote_address}: {message}")

            for client in connected_clients:
                if client != websocket:
                    await client.send(f"Message from {websocket.remote_address}: {message}")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client {websocket.remote_address} disconnected: {e}")

    finally:
        connected_clients.remove(websocket)

async def main():
    port = int(os.getenv("PORT", 8080))
    server = await websockets.serve(handler, "0.0.0.0", port,max_size=10**7)
    print(f"WebSocket server started on ws://0.0.0.0:{port}")
    await server.wait_closed()

asyncio.run(main())
