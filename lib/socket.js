'use client';

import { io } from 'socket.io-client';
import { getApiUrl } from './api';

let socketInstance = null;

export const getSocket = () => {
    if (!socketInstance) {
        socketInstance = io(getApiUrl(), {
            transports: ['websocket', 'polling'],
            autoConnect: true,
        });
    }
    return socketInstance;
};
