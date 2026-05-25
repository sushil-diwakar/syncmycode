'use client';

import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import './css/NavBar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved && saved !== theme) {
            setTheme(saved);
        }
    }, []);

    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        localStorage.setItem('theme', theme);
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: theme }));
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        router.push('/');
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    const renderThemeToggle = () => (
        <button 
            onClick={toggleTheme} 
            className="btn d-flex align-items-center justify-content-center theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ cursor: 'pointer', width: '38px', height: '38px' }}
        >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)' }}>
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
            )}
        </button>
    );

    return (
        <nav className={`navbar navbar-expand-lg px-3 py-3 shadow-sm custom-navbar ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}>
            <div className="container-fluid">
                <Link className="navbar-brand fw-extrabold d-flex align-items-center" href="/" onClick={handleLinkClick} style={{ letterSpacing: '-0.02em', fontSize: '1.4rem' }}>
                    <span className="logo-icon-wrap me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-10deg)' }}>
                            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                        </svg>
                    </span>
                    <span className="logo-text">Sync<span style={{ color: 'var(--accent-secondary)' }}>My</span>Code</span>
                </Link>

                <div className="d-flex align-items-center d-lg-none gap-2">
                    {renderThemeToggle()}
                    <button 
                        className="navbar-toggler border-0 shadow-none" 
                        type="button" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2 mt-3 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link px-3" href="/" onClick={handleLinkClick}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3" href="/about" onClick={handleLinkClick}>About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3" href="/contact" onClick={handleLinkClick}>Contact</Link>
                        </li>
                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-semibold" href="/dashboard" onClick={handleLinkClick} style={{ color: 'var(--accent-primary)' }}>
                                    Dashboard
                                </Link>
                            </li>
                        )}

                        {user ? (
                            <>
                                <li className="nav-item ms-lg-3 d-flex align-items-center gap-2 mt-2 mt-lg-0">
                                    <div className="d-flex align-items-center bg-dark bg-opacity-50 border border-secondary border-opacity-25 rounded-pill px-3 py-1.5 gap-2">
                                        <div className="avatar-bubble d-flex align-items-center justify-content-center text-white text-uppercase font-weight-bold">
                                            {user.username.substring(0, 2)}
                                        </div>
                                        <span className="text-secondary small fw-semibold d-none d-sm-inline">{user.username}</span>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <button onClick={handleLogout} className="btn btn-secondary-custom py-1.5 px-3 border-0 small ms-lg-2 bg-transparent text-secondary hover-danger-text" style={{ fontSize: '0.9rem' }}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                    <Link className="nav-link px-3" href="/login" onClick={handleLinkClick}>Sign In</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary-custom py-1.5 px-4 ms-lg-2 w-100 w-lg-auto" href="/signup" onClick={handleLinkClick} style={{ borderRadius: '20px', fontSize: '0.9rem' }}>
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item ms-lg-2 d-none d-lg-flex align-items-center">
                            {renderThemeToggle()}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
