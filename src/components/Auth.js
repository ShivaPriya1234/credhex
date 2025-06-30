import React, { useState } from 'react';
import { supabase } from '../supabase';
import Aurora from './Aurora';
import './Auth.css';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    const { error, data } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    else onLogin(data.session);
  };

  return (
    <div className="auth-page">
      {/* Aurora background FIRST */}
      <Aurora />

      {/* Foreground content */}
      <div className="auth-foreground">
        <h1 className="credhex-title">🔐CredHex</h1>
        <div className="auth-container">
          <h3>{isLogin ? 'Login to your vault' : 'Create your vault'}</h3>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAuth}>
            {isLogin ? 'Login' : 'Register'}
          </button>
          <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
            {isLogin ? 'New user? Register here' : 'Already have an account? Login'}
          </p>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Auth;
