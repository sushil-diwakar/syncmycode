'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
    const { signup, error, setError, user } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setError(null);
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router, setError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const success = await signup(username, email, password);
        setLoading(false);

        if (success) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
            <div className="card glass-panel p-4 p-md-5 animate-fade-in-up" style={{ width: '100%', maxWidth: '480px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)' }}>
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <h2 className="fw-bold mb-1">Create Account</h2>
                    <p className="text-secondary small">Join developers sharing code in real-time</p>
                </div>

                {error && (
                    <div className="alert-custom d-flex align-items-center" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2 flex-shrink-0">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-secondary small fw-semibold">Username</label>
                        <input
                            type="text"
                            className="form-control custom-input w-100"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary small fw-semibold">Email Address</label>
                        <input
                            type="email"
                            className="form-control custom-input w-100"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary small fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control custom-input w-100"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary small fw-semibold">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control custom-input w-100"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-secondary small mb-0">
                        Already have an account?{' '}
                        <Link href="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--accent-primary)' }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
