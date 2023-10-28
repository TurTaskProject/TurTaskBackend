import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axiosapi from '../api/axiosapi';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    // Styles for various elements
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login() {
    const history = useHistory();
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (event) => {
        // Update the 'username' state when the input field changes
        setUsername(event.target.value);
    }

    const handleEmailChange = (event) => {
        // Update the 'email' state when the email input field changes
        setEmail(event.target.value);
    }
    
    const handlePasswordChange = (event) => {
        // Update the 'password' state when the password input field changes
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // Send a POST request to the authentication API
        axiosapi.apiUserLogin({
            email: email,
            username: username,
            password: password
        }).then(res => {
            // On successful login, store tokens and set the authorization header
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            axiosapi.axiosInstance.defaults.headers['Authorization'] = "Bearer " + res.data.access;
            history.push('/testAuth');
        }).catch(err => {
            console.log('Login failed'); // Handle login failure
            console.log(err)
        });
    }

    const responseGoogle = async (response) => {
        // Handle Google login response
        let googleResponse = await axiosapi.googleLogin(response.access_token);
        console.log('Google Response:\n', googleResponse);

        if (googleResponse.status === 200) {
            // Store Google login tokens and set the authorization header on success
            localStorage.setItem('access_token', googleResponse.data.access_token);
            localStorage.setItem('refresh_token', googleResponse.data.refresh_token);
            axiosapi.axiosInstance.defaults.headers['Authorization'] = "Bearer " + googleResponse.data.access_token;
            history.push('/testAuth');
        }
    }

    const googleLoginflow = useGoogleLogin({
        onSuccess: async tokenResponse => {
          console.log(tokenResponse);
          responseGoogle(tokenResponse);
        },
    })

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar} />
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleEmailChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handlePasswordChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </form>

                
                    <button onClick={() => googleLoginflow()}>
                    Sign in with Google 🚀{' '}
                    </button>
            </div>
        </Container>
    );
}
