import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import TestAuth from './components/testAuth';
import IconSideNav from './components/IconSideNav';
import AuthenticantionPage from './components/authentication/AuthenticationPage';
import SignUpPage from './components/authentication/SignUpPage';
import NavBar from './components/Nav/Navbar';
import Home from './components/Home';


const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<AuthenticantionPage/>}/>
                        <Route path="/signup" element={<SignUpPage/>}/>
                        <Route path="/testAuth" element={<TestAuth/>}/>
                    </Routes>
        </div>
        {/* <div>
            <IconSideNav />
        </div> */}
        </BrowserRouter>
    );
}

export default App;