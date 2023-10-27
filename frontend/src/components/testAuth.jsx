import React, { useState, useEffect } from 'react';
import axiosapi from '../api/axiosapi';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';

function TestAuth() {
    let history = useNavigate();

    const [message, setMessage] = useState("");

    useEffect(() => {
        // Fetch the "hello" data from the server when the component mounts
        axiosapi.getGreeting().then(res => {
            console.log(res.data);
            setMessage(res.data.user);
        }).catch(err => {
            console.log(err);
            setMessage("");
        });
    }, []);

    const logout = () => {
        // Log out the user, clear tokens, and navigate to the "/testAuth" route
        axiosapi.apiUserLogout();
        history('/testAuth');
    }

    return (
        <div>
            {message !== "" && (
                <div>
                    <h1>Hello!</h1>
                    <h2>{message}</h2>
                    <Button variant="contained" onClick={logout}>Logout</Button>
                </div>
            )}
            {message === "" && <h1>Need to sign in</h1>}
        </div>
    );
}

export default TestAuth;
