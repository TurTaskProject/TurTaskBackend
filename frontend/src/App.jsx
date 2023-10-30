import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import TestAuth from './components/testAuth';
import IconSideNav from './components/IconSideNav';
import AuthenticantionPage from './components/authentication/AuthenticationPage';
import SignUpPage from './components/authentication/SignUpPage';
import NavBar from './components/Nav/Navbar';


const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
                    <NavBar/>
                    <nav>
                        <Link className={"nav-link"} to={"/"}>Home</Link>
                        <Link className={"nav-link"} to={"/login"}>Login</Link>
                        <Link className={"nav-link"} to={"/signup"}>Signup</Link>
                        <Link className={"nav-link"} to={"/testAuth"}>testAuth</Link>
                    </nav>
                    <Routes>
                        <Route path={"/"} render={() => <h1>This is Home page!</h1>} />
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