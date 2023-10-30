// import './App.css';
// import { Routes, Route, Link } from "react-router-dom";
// import Login from "./components/login";
// import TestAuth from './components/testAuth';

// function App() {
//   return (
//     <div className="App">
//       <nav>
//         <Link className={"nav-link"} to={"/"}>Home</Link>
//         <Link className={"nav-link"} to={"/login"}>Login</Link>
//         <Link className={"nav-link"} to={"/testAuth"}>testAuth</Link>
//       </nav>
//       <Routes>
//         <Route exact path={"/login"} element={Login} />
//         <Route exact path={"/testAuth"} element={TestAuth} />
//         <Route path={"/"} render={() => <h1>This is Home page!</h1>} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import './App.css';
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";
import Login from "./components/login";
import TestAuth from './components/testAuth';
import Signup from './components/signup';
import IconSideNav from "./components/IconSideNav";

const App = () => {
    return (
        <BrowserRouter>
        <div className="App">
                    <nav>
                        <Link className={"nav-link"} to={"/"}>Home</Link>
                        <Link className={"nav-link"} to={"/login"}>Login</Link>
                        <Link className={"nav-link"} to={"/signup"}>Signup</Link>
                        <Link className={"nav-link"} to={"/testAuth"}>testAuth</Link>
                    </nav>
                    <Routes>
                        <Route path={"/"} render={() => <h1>This is Home page!</h1>} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/testAuth" element={<TestAuth/>}/>
                    </Routes>
        </div>
        <div>
            <IconSideNav />
        </div>
        </BrowserRouter>
    );
}

export default App;