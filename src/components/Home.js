import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Home.css';
import testImage from './images/test.png';
const Home = () => {
    const navigate = useNavigate();

    const generateUniqueId = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    
    const handleStartCode = async () => {
        const uniqueId = generateUniqueId(); // Generate a unique ID
        navigate(`/${uniqueId}`); // Navigate to the new page

        // Initialize the new code entry
    await fetch('http://localhost:5000/api/code/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uniqueId, content: '', language: 'javascript' }),
    });
    };

    return (
        <div className="gradient-home text-center d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-white">Share Code in Real-time with Developers</h1>
            <h2 className="text-white">An online code editor for interviews, troubleshooting, teaching & more…</h2>
            <button onClick={handleStartCode} className="btn start-code-btn mt-3">
                Start Code Now
            </button>
            <img src={testImage} alt="Descriptive text for the image" className="mt-3 img-fluid" style={{ maxWidth: '75%', height: 'auto' }}/>
        </div>
    );
};

export default Home;