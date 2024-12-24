import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

const socket = io(`${process.env.REACT_APP_API_URL}`); // Connect to backend

const CodeEditor = () => {
    const { id } = useParams(); // Room ID
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isConnected, setIsConnected] = useState(true); // Track connection status
    const [isDisconnected, setIsDisconnected] = useState(false); // Track disconnection state
    const languageExtensions = {
        javascript: javascript(),
        python: python(),
    };

    useEffect(() => {
        // Fetch content from the backend
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/code/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.content);
                    setLanguage(data.language || 'javascript');
                } else {
                    console.log('No existing content, initializing...');
                    await fetch(`${process.env.REACT_APP_API_URL}/api/code/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, content: '', language: 'javascript' }),
                    });
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchData();

        // Join the room for real-time updates
        console.log(`Joining room: ${id}`);
        socket.emit('join', id);

        // Listen for real-time updates
        socket.on('text-change', (updatedContent) => {
            console.log('Real-time update received:', updatedContent);
            setContent(updatedContent); // Update the editor content
        });

        // Track socket connection and disconnection
        socket.on('connect', () => {
            console.log('Connected to the server');
            console.log(`Joining room: ${id}`);
            socket.emit('join', id);
            fetchData();
            setIsConnected(true);
            setIsDisconnected(false);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
            setIsConnected(false);
            setIsDisconnected(true);
        });

        return () => {
            console.log('Cleaning up socket listeners...');
            socket.off('text-change');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [id]);

    const handleContentChange = (value) => {
        if (!isConnected) return; // Prevent changes if disconnected

        setContent(value);

        // Emit changes to other clients
        console.log(`Emitting text change for room: ${id}`);
        socket.emit('edit', { roomId: id, content: value });

        // Save to backend
        fetch(`${process.env.REACT_APP_API_URL}/api/code/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: value, language }),
        });
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);

        // Save language to backend
        fetch(`${process.env.REACT_APP_API_URL}/api/code/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, language: newLanguage }),
        });
    };

    const handleReconnect = () => {
        console.log(`Reconnecting to room: ${id}`);
        socket.connect(); // Reconnect the socket
        setIsDisconnected(false); // Hide disconnection message
    };

    return (
        <div style={{ padding: '20px' }}>
            {isDisconnected && (
                <div
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        textAlign: 'center',
                    }}
                >
                    <strong>You are disconnected. Please reconnect to continue.</strong>
                    <button
                        onClick={handleReconnect}
                        style={{
                            marginLeft: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#fff',
                            color: '#000',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                        }}
                    >
                        Reconnect
                    </button>
                </div>
            )}

            <select value={language} onChange={handleLanguageChange} disabled={!isConnected}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
            </select>

            <CodeMirror
                value={content}
                extensions={[languageExtensions[language]]}
                onChange={(value) => handleContentChange(value)}
                height="400px"
                editable={isConnected} // Disable editing if not connected
            />
        </div>
    );
};

export default CodeEditor;