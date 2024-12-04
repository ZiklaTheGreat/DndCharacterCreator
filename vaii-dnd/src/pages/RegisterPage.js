import "../styles/LoginPageStyle.css";
import React, { useState } from 'react';
import axios from 'axios';
import "../styles/LoginPageStyle.css";

function RegisterPage() {
    return (
        <div>
            <main className="content">
                <div className="login-box">
                    <h2>Register</h2>
                    <form>
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" placeholder="Enter your username" />
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" />
                        <button type="submit" className="btn-submit">Register</button>
                    </form>
                    <p className="register-link">
                        Already have an account? <a href="/Login">Login here</a>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default RegisterPage;
