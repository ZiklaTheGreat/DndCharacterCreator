import React from 'react';
import "../styles/LoginPageStyle.css";

function LoginPage() {
    return (
        <div>
            <main className="content">
                <div className="login-box">
                    <h2>Login</h2>
                    <form>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" placeholder="Enter your username" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" />
                        </div>
                        <button type="submit" className="btn-submit">Login</button>
                    </form>
                    <p className="register-link">
                        Don't have an account? <a href="/Register">Register here</a>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default LoginPage;
