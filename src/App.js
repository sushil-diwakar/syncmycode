import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/CodeEditor';
import NavBar from './components/NavBar';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <NavBar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/:id" element={<CodeEditor />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;