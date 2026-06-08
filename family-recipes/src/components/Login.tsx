// import { useState } from 'react'
import '../styles/CreateUser.css'
import { supabase } from "../lib/supabase";
import { useState } from 'react';

export default function Login() {
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
    }
  }

  return (
    <>
        <div>
            <h1>Login</h1>
        </div>
        <div className='login_box'>
            <h2>Enter your email:</h2>
            <input type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h2>Enter your password:</h2>
            <input type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Create Account</button>
        </div>
    </>
  )
}
