'use client';

import { useState } from 'react';
import Link from 'next/link';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && email && message) {
            setSubmitted(true);
        }
    };

    return (
        <div className="container py-5 text-start animate-fade-in-up">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card glass-panel p-4 p-md-5">
                        <h1 className="fw-extrabold display-6 mb-2">Contact Us</h1>
                        <p className="text-secondary small mb-4">Have questions or feedback? Drop us a message below.</p>

                        {submitted ? (
                            <div className="alert-success-custom d-flex flex-column align-items-center text-center p-4" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-success">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                                <h4 className="fw-bold mb-1">Message Sent!</h4>
                                <p className="small mb-4 text-secondary">Thank you for reaching out. We will get back to you as soon as possible.</p>
                                <button onClick={() => setSubmitted(false)} className="btn btn-secondary-custom px-4 py-1.5 small">
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-secondary small fw-semibold">Your Name</label>
                                    <input
                                        type="text"
                                        className="form-control custom-input w-100"
                                        placeholder="Alex Mercer"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-secondary small fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control custom-input w-100"
                                        placeholder="alex@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-secondary small fw-semibold">Message</label>
                                    <textarea
                                        className="form-control custom-input w-100"
                                        rows="4"
                                        placeholder="How can we help you?"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        style={{ resize: 'none' }}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary-custom w-100 py-2">
                                    Send Message
                                </button>
                            </form>
                        )}

                        <div className="text-center mt-4">
                            <Link href="/" className="small text-decoration-none" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
