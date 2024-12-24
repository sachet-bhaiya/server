import asyncio
import os
import websockets

# List to keep track of connected clients
connected_clients = set()

async def handler(websocket, path):
    # Add the new client to the set of connected clients
    connected_clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")
    
    try:
        # Handle incoming messages
        async for message in websocket:
            print(f"Received message from {websocket.remote_address}: {message}")

            # Broadcast the message to all connected clients
            for client in connected_clients:
                if client != websocket:
                    await client.send(f"Message from {websocket.remote_address}: {message}")

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client {websocket.remote_address} disconnected: {e}")

    finally:
        # Remove the client from the set when they disconnect
        connected_clients.remove(websocket)

# Start the server
async def main():
    # Get the PORT from environment variable (default to 8080 if not set)
    port = int(os.getenv("PORT", 8080))
    # Start the WebSocket server
    server = await websockets.serve(handler, "0.0.0.0", port)
    print(f"WebSocket server started on ws://0.0.0.0:{port}")
    await server.wait_closed()

asyncio.run(main())
