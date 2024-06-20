// client/src/services/socket.js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL, {
    transports: ['websocket'],
    cors: {
        origin: '*', // Adjust this if needed
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

export default socket;
