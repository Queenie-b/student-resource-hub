import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LockKeyhole, Mail } from 'lucide-react';
import './SignIn.css';

function SignIn({ onSignIn }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        if (onSignIn(email, password)) navigate('/');
    }

    return (
        <main className="signin-page page-fade">
            <section className="signin-card" aria-labelledby="signin-title">
                <div className="signin-brand-mark" aria-hidden="true"><BookOpen size={25} /></div>
                <p className="signin-eyebrow">STUDENT RESOURCE HUB</p>
                <h1 id="signin-title">Welcome back</h1>
                <p className="signin-intro">Sign in to pick up where your learning left off.</p>

                <form className="signin-form" onSubmit={handleSubmit}>
                    <label htmlFor="signin-email">Email address</label>
                    <div className="signin-input-wrap">
                        <Mail size={18} aria-hidden="true" />
                        <input
                            id="signin-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <label htmlFor="signin-password">Password</label>
                    <div className="signin-input-wrap">
                        <LockKeyhole size={18} aria-hidden="true" />
                        <input
                            id="signin-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button className="signin-submit" type="submit">Sign In</button>
                </form>

                <p className="signin-signup-prompt">New to the hub? <Link to="/signup">Create an account</Link></p>
            </section>
        </main>
    );
}

export default SignIn;
