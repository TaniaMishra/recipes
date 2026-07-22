// import { useState } from 'react'
import '../styles/CreateUser.css'
import { supabase } from "../lib/supabase";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async() => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.log("ERROR LOGGING IN", error);
    } else if (data) {
      console.log("Log In Successful", data.user);
      nav("/my-profile");
    }
  }
  const handleCreateReroute = () => {
    nav("/create-account");
  }

  return (
    <>
        <div>
            <h1>Login</h1>
        </div>
        <div className='login_box'>
            <h2>Enter your email:</h2>
            <input type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h2>Enter your password:</h2>
            <input type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
        <button onClick={handleCreateReroute}>Don't have an account? Create one here</button>
    </>
  )
}
