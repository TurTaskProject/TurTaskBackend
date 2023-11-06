import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import TestAuth from './components/testAuth';
import LoginPage from './components/authentication/LoginPage';
import SignUpPage from './components/authentication/SignUpPage';
import NavBar from './components/nav/Navbar';
import Home from './components/Home';
import ProfileUpdate from './components/ProfileUpdatePage';
import Calendar from './components/calendar/calendar';

const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/signup" element={<SignUpPage/>}/>
                        <Route path="/testAuth" element={<TestAuth/>}/>
                        <Route path="/update_profile" element={<ProfileUpdate/>}/>
                        <Route path="/calendar" element={<Calendar/>}/>
                    </Routes>
        </div>
        </BrowserRouter>
    );
}

export default App;