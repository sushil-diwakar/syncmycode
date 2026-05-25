import Link from 'next/link';

const About = () => {
    return (
        <div className="container py-5 text-start animate-fade-in-up">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card glass-panel p-4 p-md-5">
                        <h1 className="fw-extrabold display-6 mb-4">About SyncMyCode</h1>
                        <p className="text-secondary fs-5 mb-4" style={{ lineHeight: '1.7' }}>
                            SyncMyCode is a next-generation real-time collaborative coding environment. Built for modern engineers, tutors, and technical interviewers, it allows groups of developers to connect, edit, review, and write code together simultaneously in a secure web ecosystem.
                        </p>
                        
                        <h3 className="fw-bold mt-4 mb-3">Our Core Principles</h3>
                        <div className="row g-4 mt-1">
                            <div className="col-md-6">
                                <div className="p-3 rounded-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                                    <h5 className="fw-bold mb-2">🚀 Speed & Sync</h5>
                                    <p className="small mb-0 text-secondary">Powered by high-frequency socket engines that synchronize code modifications in milliseconds without conflicts.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 rounded-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                                    <h5 className="fw-bold mb-2">💎 Beautiful UI</h5>
                                    <p className="small mb-0 text-secondary">Crafted with modern responsive layouts, tailored HSL color aesthetics, glowing elements, and dark gradients.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 rounded-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                                    <h5 className="fw-bold mb-2">🔒 Secure Storage</h5>
                                    <p className="small mb-0 text-secondary">Store your personal rooms in a secure profile workspace, accessible at any time through standard authentication layers.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 rounded-3" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                                    <h5 className="fw-bold mb-2">💬 Native Interactions</h5>
                                    <p className="small mb-0 text-secondary">Collaborate deeply with live user listings and integrated real-time chats inside each coding session room.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-5 pt-3">
                            <Link href="/" className="btn btn-primary-custom px-4 py-2 rounded-pill">
                                Back to Workspace
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
