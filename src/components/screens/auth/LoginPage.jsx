import React, { useState } from 'react';
import axios from 'axios';
import UserProfile from "../home/profile/userprofile/UserProfile.jsx";
import Skils from "../home/profile/Skills/Skils.jsx";
import UserProject from "../home/profile/userproject/UserProject.jsx";
import Logout from "../auth/logout/Logout.jsx";

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://01.kood.tech/api/auth/signin', {}, {
                auth: {
                    username: identifier,
                    password: password
                }
            });
            const token = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setIsLoggedIn(true);
        } catch (err) {
            console.error('Error during login:', err);
            setError('Invalid username/email or password');
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <div className="header">
                        <h1 style={{marginRight: 'auto'}}>Welcome</h1>
                        <Logout />
                    </div>

                    <div className="container">
                        <div className="block">
                            <h1>Профиль пользователя</h1>
                            <UserProfile token={token}/>
                        </div>
                        <div className="block">
                            <Skils token={token}/>
                        </div>
                        <div className="block">
                            <UserProject token={token}/>
                        </div>
                    </div>
                </>
            ) : (
                <div className="login-container">
                    <form className="login-form" onSubmit={handleLogin}>
                        <h2>Login</h2>
                        <div className="form-group">
                            <label htmlFor="username">Username/Email:</label>
                            <input type="text" id="username" value={identifier}
                                   onChange={(e) => setIdentifier(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button type="submit">Login</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>

            )}
        </div>
    );
};

export default LoginPage;
