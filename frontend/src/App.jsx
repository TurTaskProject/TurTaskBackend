import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TestAuth from './components/testAuth';
import LoginPage from './components/authentication/LoginPage';
import SignUpPage from './components/authentication/SignUpPage';
import NavBar from './components/nav/Navbar';
import Home from './components/Home';
import ProfileUpdate from './components/ProfileUpdatePage';
import Calendar from './components/calendar/calendar';
import KanbanBoard from './components/kanbanBoard/kanbanBoard';
import IconSideNav from './components/IconSideNav';
import Eisenhower from './components/EisenhowerMatrix/Eisenhower';

const App = () => {
    return (
        <BrowserRouter>
        <div className='display: flex'>
                <IconSideNav />
                <div className='flex-1'>
                <NavBar />
                <div className='flex items-center justify-center'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<KanbanBoard />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/testAuth" element={<TestAuth />} />
                        <Route path="/update_profile" element={<ProfileUpdate />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/priority" element={<Eisenhower/>} />
                    </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
