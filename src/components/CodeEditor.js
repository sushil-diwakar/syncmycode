import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';

const socket = io('https://syncmycode-server.onrender.com'); // Connect to backend

const CodeEditor = () => {
    const { id } = useParams(); // Room ID
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const languageExtensions = {
        javascript: javascript(),
        python: python(),
    };

    useEffect(() => {
        // Fetch content from the backend
        const fetchData = async () => {
            try {
                const response = await fetch(`https://syncmycode-server.onrender.com/api/code/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.content);
                    setLanguage(data.language || 'javascript');
                } else {
                    console.log('No existing content, initializing...');
                    await fetch('https://syncmycode-server.onrender.com/api/code/create', {
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

        return () => {
            console.log('Cleaning up socket listeners...');
            socket.off('text-change');
        };
    }, [id]);

    const handleContentChange = (value) => {
        setContent(value);

        // Emit changes to other clients
        console.log(`Emitting text change for room: ${id}`);
        socket.emit('edit', { roomId: id, content: value });

        // Save to backend
        fetch(`https://syncmycode-server.onrender.com/api/code/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: value, language }),
        });
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);

        // Save language to backend
        fetch(`https://syncmycode-server.onrender.com/api/code/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, language: newLanguage }),
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <select value={language} onChange={handleLanguageChange}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
            </select>
            <CodeMirror
                value={content}
                extensions={[languageExtensions[language]]}
                onChange={(value) => handleContentChange(value)}
                height="400px"
            />
        </div>
    );
};

export default CodeEditor;