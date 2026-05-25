'use client';

import { io } from 'socket.io-client';

let socketInstance = null;

export const getSocket = () => {
    if (!socketInstance) {
        socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`, {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });
    }
    return socketInstance;
};
