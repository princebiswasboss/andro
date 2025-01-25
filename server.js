const WebSocket = require('ws');
const fetch = require('node-fetch');

// Telegram bot credentials
const BOT_TOKEN = 'YOUR_BOT_TOKEN';  // Replace with your Telegram bot token
const CHAT_ID = 'YOUR_CHAT_ID';      // Replace with your Telegram chat ID

// WebSocket server setup
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    // When receiving location data from the client (Android app)
    ws.on('message', async (message) => {
        console.log('Received message:', message);

        // Parse the message (assumes it's a JSON string)
        const locationData = JSON.parse(message);

        // Send the location to Telegram
        await sendLocationToTelegram(locationData.latitude, locationData.longitude);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Send location to Telegram bot
async function sendLocationToTelegram(latitude, longitude) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendLocation`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            latitude: latitude,
            longitude: longitude,
        }),
    });

    const data = await response.json();
    console.log('Location sent to Telegram:', data);
}

console.log('WebSocket server running on ws://localhost:8080');
