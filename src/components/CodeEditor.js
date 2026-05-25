'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { AuthContext } from '../context/AuthContext';
import { getSocket } from '../../lib/socket';
import { getApiUrl } from '../../lib/api';

const CodeEditor = ({ id }) => {
    const { user } = useContext(AuthContext);

    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [editorTheme, setEditorTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            return saved === 'light' ? 'light' : 'dark';
        }
        return 'dark';
    });
    const [title, setTitle] = useState('Loading Session...');
    const [creator, setCreator] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const [isDisconnected, setIsDisconnected] = useState(false);

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = getSocket();
    }, []);

    useEffect(() => {
        const handleThemeChange = (e) => {
            setEditorTheme(e.detail);
        };
        window.addEventListener('theme-changed', handleThemeChange);
        return () => window.removeEventListener('theme-changed', handleThemeChange);
    }, []);

    const [activeUsers, setActiveUsers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [saveStatus, setSaveStatus] = useState('synced');
    const [copied, setCopied] = useState(false);

    const chatEndRef = useRef(null);
    const saveTimeoutRef = useRef(null);

    const languageExtensions = {
        javascript: javascript(),
        python: python(),
        html: html(),
        css: css(),
        cpp: cpp(),
        java: java(),
        sql: sql(),
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        const socket = socketRef.current;

        const fetchSessionDetails = async () => {
            try {
                const response = await fetch(`${getApiUrl()}/v1/code/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setContent(data.content);
                    setLanguage(data.language || 'javascript');
                    setTitle(data.title || 'Collaborative Snippet');
                    setCreator(data.creator);
                } else {
                    console.log('Session not found, creating a new session...');
                    await fetch(`${getApiUrl()}/v1/code/create`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, content: '', language: 'javascript', title: 'Shared Workspace' }),
                    });
                    setTitle('Shared Workspace');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };

        fetchSessionDetails();

        const username = user ? user.username : `Guest-${socket.id?.substring(0, 4) || Math.random().toString(36).substring(2, 6)}`;

        console.log(`Socket connecting and joining room: ${id} as ${username}`);
        socket.emit('join', { roomId: id, username });

        socket.on('text-change', (updatedContent) => {
            setContent(updatedContent);
            setSaveStatus('synced');
        });

        socket.on('update-users', (usersList) => {
            setActiveUsers(usersList);
        });

        socket.on('language-change-broadcast', (updatedLanguage) => {
            setLanguage(updatedLanguage);
        });

        socket.on('chat-message', (message) => {
            setChatMessages((prev) => [...prev, message]);
        });

        socket.on('connect', () => {
            console.log('Connected to socket gateway');
            const currentUsername = user ? user.username : `Guest-${socket.id?.substring(0, 4) || 'Anon'}`;
            socket.emit('join', { roomId: id, username: currentUsername });
            setIsConnected(true);
            setIsDisconnected(false);
            fetchSessionDetails();
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket gateway');
            setIsConnected(false);
            setIsDisconnected(true);
        });

        return () => {
            console.log('Cleaning up socket bindings...');
            socket.off('text-change');
            socket.off('update-users');
            socket.off('language-change-broadcast');
            socket.off('chat-message');
            socket.off('connect');
            socket.off('disconnect');
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [id, user]);

    const handleContentChange = (value) => {
        if (!isConnected) return;

        setContent(value);
        setSaveStatus('saving');

        socketRef.current.emit('edit', { roomId: id, content: value });

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            fetch(`${getApiUrl()}/v1/code/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: value, language }),
            })
            .then((res) => {
                if (res.ok) setSaveStatus('synced');
                else setSaveStatus('error');
            })
            .catch(() => setSaveStatus('error'));
        }, 1000);
    };

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);

        socketRef.current.emit('language-change', { roomId: id, language: newLanguage });

        fetch(`${getApiUrl()}/v1/code/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, language: newLanguage }),
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedMessage = messageText.trim();
        if (!trimmedMessage) return;

        const senderName = user ? user.username : 'Guest User';

        socketRef.current.emit('send-message', { roomId: id, sender: senderName, text: trimmedMessage });
        setMessageText('');
    };

    const handleReconnect = () => {
        socketRef.current.connect();
        setIsDisconnected(false);
    };

    const handleCopyUrl = () => {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error('Failed to copy: ', err));
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        if (name.startsWith('Guest-')) return 'G';
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = [
            'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="container-fluid py-4" style={{ minHeight: '85vh', position: 'relative' }}>
            {isDisconnected && (
                <div className="alert-custom d-flex align-items-center justify-content-between mx-auto mb-4 animate-fade-in-up" style={{ maxWidth: '800px', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.2)' }}>
                    <div className="d-flex align-items-center">
                        <span className="spinner-grow spinner-grow-sm text-danger me-3" role="status"></span>
                        <span><strong>Connection lost.</strong> Sync is paused. Click Reconnect to resume peer programming.</span>
                    </div>
                    <button onClick={handleReconnect} className="btn btn-sm btn-light border-0 py-1.5 px-3" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#000' }}>
                        Reconnect
                    </button>
                </div>
            )}

            <div className="row g-4 justify-content-center">
                <div className="col-lg-8 col-xl-9 text-start order-lg-last">
                    <div className="card glass-panel d-flex flex-column overflow-hidden" style={{ minHeight: '660px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="d-flex align-items-center justify-content-between px-4 py-3 editor-header-panel border-bottom border-secondary border-opacity-25">
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-semibold fs-5 text-white">Editor Sandbox</span>
                                
                                <div className="d-inline-flex align-items-center gap-1.5">
                                    {saveStatus === 'saving' && (
                                        <>
                                            <span className="spinner-border spinner-border-sm text-secondary" role="status" style={{ width: '12px', height: '12px' }}></span>
                                            <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>saving edits...</span>
                                        </>
                                    )}
                                    {saveStatus === 'synced' && (
                                        <>
                                            <span className="d-inline-block rounded-circle bg-success" style={{ width: '6px', height: '6px' }}></span>
                                            <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>autosaved to cloud</span>
                                        </>
                                    )}
                                    {saveStatus === 'error' && (
                                        <>
                                            <span className="d-inline-block rounded-circle bg-danger" style={{ width: '6px', height: '6px' }}></span>
                                            <span className="text-danger small" style={{ fontSize: '0.75rem' }}>save failure</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <label className="text-secondary small fw-medium mb-0 d-none d-sm-inline">Syntax Language:</label>
                                <select
                                    className="form-select custom-input py-1.5 pe-4 ps-2.5 text-sm"
                                    value={language}
                                    onChange={handleLanguageChange}
                                    disabled={!isConnected}
                                    style={{ fontSize: '0.85rem', width: '130px', appearance: 'auto' }}
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="sql">SQL</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-grow-1 text-start" style={{ background: editorTheme === 'dark' ? '#0d1117' : '#ffffff' }}>
                            <CodeMirror
                                value={content}
                                theme={editorTheme}
                                extensions={[languageExtensions[language]]}
                                onChange={(value) => handleContentChange(value)}
                                height="580px"
                                editable={isConnected}
                                style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-xl-3 text-start order-lg-first">
                    <div className="card glass-panel p-3 d-flex flex-column" style={{ minHeight: '660px', height: '100%', maxHeight: '740px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className={`badge px-2 py-1 rounded-pill ${isConnected ? 'text-success bg-success bg-opacity-10 border border-success border-opacity-20' : 'text-danger bg-danger bg-opacity-10 border border-danger border-opacity-20'}`} style={{ fontSize: '0.75rem' }}>
                                    <span className="d-inline-block rounded-circle me-1.5" style={{ width: '6px', height: '6px', backgroundColor: isConnected ? '#10b981' : '#ef4444' }}></span>
                                    {isConnected ? 'Sync Online' : 'Offline'}
                                </span>
                                <span className="text-secondary small fw-medium">Room: <strong>{id}</strong></span>
                            </div>
                            <h4 className="fw-bold mb-1 text-truncate">{title}</h4>
                            {creator ? (
                                <div className="text-secondary small mb-3" style={{ fontSize: '0.8rem' }}>
                                    Created by: <span className="fw-semibold text-secondary">{creator.username}</span>
                                </div>
                            ) : (
                                <div className="text-secondary small mb-3" style={{ fontSize: '0.8rem' }}>
                                    Created by: <span className="fw-semibold text-secondary">Guest</span>
                                </div>
                            )}
                            <button onClick={handleCopyUrl} className={`btn ${copied ? 'btn-success' : 'btn-secondary-custom'} w-100 py-2 d-flex align-items-center justify-content-center gap-2 small`} style={{ fontSize: '0.85rem' }}>
                                {copied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Copied Invite Link!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                                        </svg>
                                        Copy Room URL
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mb-4">
                            <h5 className="text-secondary small fw-bold text-uppercase mb-3 d-flex align-items-center">
                                Active Devs ({activeUsers.length})
                            </h5>
                            <div className="d-flex flex-wrap gap-2 overflow-auto" style={{ maxHeight: '80px' }}>
                                {activeUsers.map((usr) => (
                                    <div key={usr.socketId} className="d-inline-flex align-items-center active-user-badge rounded-pill px-2.5 py-1 gap-1.5" title={usr.username}>
                                        <div className="avatar-bubble d-flex align-items-center justify-content-center text-white text-uppercase" style={{ width: '20px', height: '20px', fontSize: '0.6rem', background: getAvatarColor(usr.username) }}>
                                            {getUserInitials(usr.username)}
                                        </div>
                                        <span className="text-secondary small fw-medium text-truncate" style={{ maxWidth: '80px', fontSize: '0.75rem' }}>{usr.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
                            <h5 className="text-secondary small fw-bold text-uppercase mb-2 d-flex align-items-center">
                                Live Session Chat
                            </h5>
                            
                            <div className="flex-grow-1 overflow-auto chat-box-container border border-secondary border-opacity-25 rounded p-3 mb-2" style={{ maxHeight: '300px', minHeight: '220px' }}>
                                {chatMessages.length === 0 ? (
                                    <div className="h-100 d-flex align-items-center justify-content-center text-muted small text-center px-3">
                                        Type a message below to start chatting with other developers in this session.
                                    </div>
                                ) : (
                                    chatMessages.map((msg, index) => {
                                        const isSystem = msg.sender === 'System';
                                        return (
                                            <div key={index} className="mb-2 text-start">
                                                {isSystem ? (
                                                    <div className="text-muted small fst-italic text-center py-1">
                                                        {msg.text}
                                                    </div>
                                                ) : (
                                                    <div className="small">
                                                        <div className="d-flex justify-content-between align-items-baseline mb-0.5">
                                                            <strong className={msg.sender === user?.username ? 'text-accent' : ''} style={{ fontSize: '0.8rem', color: msg.sender === user?.username ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{msg.sender}</strong>
                                                            <span className="text-muted" style={{ fontSize: '0.65rem' }}>{msg.timestamp}</span>
                                                        </div>
                                                        <div className="chat-message-bubble p-2 rounded text-secondary border border-secondary border-opacity-10" style={{ wordBreak: 'break-word', fontSize: '0.8rem' }}>
                                                            {msg.text}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="d-flex gap-1.5">
                                <input
                                    type="text"
                                    className="form-control custom-input py-1.5 text-sm w-100"
                                    placeholder="Message Room..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    disabled={!isConnected}
                                    style={{ fontSize: '0.85rem' }}
                                />
                                <button type="submit" className="btn btn-primary-custom px-3 py-1.5 d-flex align-items-center" disabled={!isConnected}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default CodeEditor;
