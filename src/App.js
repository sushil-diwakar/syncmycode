import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CodeEditor from './components/CodeEditor';
import NavBar from './components/NavBar';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/:id" element={<CodeEditor />} />
            </Routes>
            <Footer/>
        </Router>
    );
};

export default App;