'use client';

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import './css/Dashboard.css';

const languageColors = {
    javascript: { label: 'JS', color: '#d97706', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.25)' },
    python: { label: 'Py', color: '#0284c7', bg: 'rgba(2,132,199,0.12)', border: 'rgba(2,132,199,0.25)' },
    html: { label: 'HTML', color: '#dc2626', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.25)' },
    css: { label: 'CSS', color: '#4f46e5', bg: 'rgba(79,70,229,0.12)', border: 'rgba(79,70,229,0.25)' },
    cpp: { label: 'C++', color: '#059669', bg: 'rgba(5,150,105,0.12)', border: 'rgba(5,150,105,0.25)' },
    java: { label: 'Java', color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)' },
    sql: { label: 'SQL', color: '#d97706', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.25)' }
};

const langOrder = ['javascript', 'python', 'html', 'css', 'cpp', 'java', 'sql'];
const langNames = {
    javascript: 'JavaScript', python: 'Python', html: 'HTML', css: 'CSS',
    cpp: 'C++', java: 'Java', sql: 'SQL'
};

const Dashboard = () => {
    const { token, user, logout } = useContext(AuthContext);
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [joinRoomId, setJoinRoomId] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const fetchUserCodes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/v1/code/user/my-codes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setCodes(data);
            } else if (res.status === 401) {
                logout();
            } else {
                setError('Failed to load saved snippets');
            }
        } catch (err) {
            console.error('Error fetching snippets:', err);
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [token, API_URL, logout]);

    useEffect(() => {
        if (token) {
            fetchUserCodes();
        }
    }, [token, fetchUserCodes]);

    const generateUniqueId = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleCreateSnippet = async (e) => {
        e.preventDefault();
        setError('');
        const uniqueId = generateUniqueId();
        const snippetTitle = title.trim() || 'Untitled Snippet';

        try {
            setActionLoading(true);
            const res = await fetch(`${API_URL}/v1/code/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: uniqueId,
                    content: '',
                    language,
                    title: snippetTitle,
                    isPublic: true,
                }),
            });

            if (res.ok) {
                router.push(`/${uniqueId}`);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create snippet');
            }
        } catch (err) {
            console.error('Error creating snippet:', err);
            setError('Failed to connect to server');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSnippet = async (id) => {
        if (!window.confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/v1/code/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setCodes(codes.filter((c) => c.id !== id));
            } else {
                alert('Failed to delete the snippet');
            }
        } catch (err) {
            console.error('Error deleting snippet:', err);
            alert('Failed to connect to server');
        }
    };

    const handleCopyLink = (id) => {
        const shareUrl = `${window.location.origin}/${id}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopiedId(id);
                setTimeout(() => setCopiedId(null), 2000);
            })
            .catch((err) => console.error('Failed to copy text: ', err));
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        const trimmedRoom = joinRoomId.trim();
        if (trimmedRoom) {
            router.push(`/${trimmedRoom}`);
        }
    };

    const uniqueLanguages = new Set(codes.map(c => c.language)).size;
    const maxLangCount = Math.max(1, ...langOrder.map(l => codes.filter(c => c.language === l).length));

    const getRelativeTime = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const latestSnippet = codes.length > 0
        ? codes.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b)
        : null;

    return (
        <div className="container py-4 dashboard-wrapper animate-fade-in-up">
            {/* Welcome Banner */}
            <div className="dashboard-welcome">
                <div className="welcome-avatar">
                    {(user?.username?.[0] || 'D').toUpperCase()}
                </div>
                <div className="welcome-content">
                    <h1 className="welcome-title">
                        Welcome back, {user?.username || 'Developer'}
                    </h1>
                    <p className="welcome-subtitle">
                        Manage your snippets, create new rooms, or jump back into collaborative coding.
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-value">{codes.length}</span>
                    <span className="stat-label">Total Snippets</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{uniqueLanguages}</span>
                    <span className="stat-label">Languages Used</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">
                        {latestSnippet ? getRelativeTime(latestSnippet.createdAt) : '--'}
                    </span>
                    <span className="stat-label">Latest Activity</span>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert-custom d-flex align-items-center mb-4" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2 flex-shrink-0">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>{error}</div>
                </div>
            )}

            {/* Action Cards */}
            <div className="row g-4 mb-5">
                {/* Create Snippet */}
                <div className="col-lg-7">
                    <div className="action-card">
                        <div className="action-card-header">
                            <div className="action-card-icon primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="action-card-title">Create Collaborative Snippet</h3>
                                <p className="action-card-subtitle">Start a new real-time coding room</p>
                            </div>
                        </div>
                        <form onSubmit={handleCreateSnippet}>
                            <div className="row g-3">
                                <div className="col-md-7">
                                    <label className="form-label text-secondary small fw-semibold">Snippet Title</label>
                                    <input
                                        type="text"
                                        className="form-control custom-input w-100"
                                        placeholder="e.g. Code Review Session"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={actionLoading}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label text-secondary small fw-semibold">Language</label>
                                    <select
                                        className="form-select custom-input w-100"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        disabled={actionLoading}
                                        style={{ appearance: 'auto' }}
                                    >
                                        {langOrder.map(l => (
                                            <option key={l} value={l}>{langNames[l]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating room...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                                    <path d="M5 12h14"/><path d="M12 5v14"/>
                                                </svg>
                                                Start Live Coding Session
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Quick Join + Language Distribution */}
                <div className="col-lg-5">
                    <div className="action-card d-flex flex-column">
                        <div>
                            <div className="action-card-header">
                                <div className="action-card-icon accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="action-card-title">Quick Join Room</h3>
                                    <p className="action-card-subtitle">Enter a room code to join an existing session</p>
                                </div>
                            </div>
                            <form onSubmit={handleJoinRoom}>
                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control custom-input"
                                        placeholder="Enter Room Code (e.g. ax45t9)"
                                        value={joinRoomId}
                                        onChange={(e) => setJoinRoomId(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary-custom" style={{ padding: '10px 16px' }}>
                                        Join
                                    </button>
                                </div>
                            </form>
                        </div>

                        {codes.length > 0 && (
                            <div className="mt-auto pt-3">
                                <div className="d-flex align-items-center gap-2 mb-2" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                        Language Distribution
                                    </span>
                                </div>
                                <div className="lang-distribution">
                                    {langOrder.map(l => {
                                        const count = codes.filter(c => c.language === l).length;
                                        if (count === 0) return null;
                                        const lang = languageColors[l];
                                        return (
                                            <div className="lang-bar-row" key={l}>
                                                <span className="lang-bar-label" style={{ color: lang.color }}>{lang.label}</span>
                                                <div className="lang-bar-track">
                                                    <div
                                                        className="lang-bar-fill"
                                                        style={{
                                                            width: `${(count / maxLangCount) * 100}%`,
                                                            background: lang.color
                                                        }}
                                                    />
                                                </div>
                                                <span className="lang-bar-count">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Snippets Section */}
            <div className="snippets-header">
                <div className="snippets-header-left">
                    <h2 className="snippets-title">Your Saved Snippets</h2>
                    <span className="snippets-badge">{codes.length}</span>
                </div>
                <button
                    onClick={fetchUserCodes}
                    className="refresh-btn"
                    disabled={loading}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
                    >
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                        <path d="M16 16h5v5"/>
                    </svg>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {loading ? (
                <div className="row g-4">
                    {[1, 2, 3].map((n) => (
                        <div className="col-md-6 col-lg-4" key={n}>
                            <div className="skeleton-card" style={{ height: '180px' }}>
                                <div className="placeholder-glow">
                                    <span className="placeholder col-6 bg-secondary mb-3" style={{ height: '24px', borderRadius: '4px', display: 'block' }}></span>
                                    <span className="placeholder col-3 bg-secondary mb-4" style={{ height: '20px', borderRadius: '4px', display: 'block' }}></span>
                                    <span className="placeholder col-10 bg-secondary mb-2" style={{ height: '14px', borderRadius: '4px', display: 'block' }}></span>
                                    <span className="placeholder col-4 bg-secondary" style={{ height: '36px', borderRadius: '6px', marginTop: '12px', display: 'block' }}></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : codes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                            <path d="m10 13-2 2 2 2"/>
                            <path d="m14 17 2-2-2-2"/>
                        </svg>
                    </div>
                    <h4 className="empty-state-title">No snippets found</h4>
                    <p className="empty-state-text">
                        Create a collaborative live snippet above to begin editing code, teaching, or running mock technical interviews with other developers.
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {codes.map((snippet) => {
                        const lang = languageColors[snippet.language] || { label: '?', color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.25)' };
                        return (
                            <div className="col-md-6 col-lg-4" key={snippet.id}>
                                <div className="snippet-card">
                                    <div className="snippet-card-top">
                                        <h4 className="snippet-card-title" title={snippet.title}>
                                            {snippet.title}
                                        </h4>
                                        <span
                                            className="snippet-card-badge"
                                            style={{
                                                color: lang.color,
                                                background: lang.bg,
                                                border: `1px solid ${lang.border}`
                                            }}
                                        >
                                            {lang.label}
                                        </span>
                                    </div>

                                    <div className="snippet-card-meta">
                                        <span className="snippet-card-room">
                                            Room:
                                            <code>{snippet.id}</code>
                                        </span>
                                        <span className="snippet-card-date">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                            </svg>
                                            {new Date(snippet.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div className="snippet-card-actions">
                                        <button
                                            onClick={() => router.push(`/${snippet.id}`)}
                                            className="snippet-btn-primary"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                            </svg>
                                            Open
                                        </button>
                                        <button
                                            onClick={() => handleCopyLink(snippet.id)}
                                            className="snippet-btn-icon"
                                            title="Copy Share Link"
                                        >
                                            {copiedId === snippet.id ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success" style={{ color: 'var(--success)' }}>
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSnippet(snippet.id)}
                                            className="snippet-btn-icon danger"
                                            title="Delete Snippet"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
