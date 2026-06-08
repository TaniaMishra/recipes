// import { useState } from 'react'
import '../styles/CreateUser.css'
import { supabase } from "../lib/supabase";
import { useState } from 'react';

export default function CreateUser() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleCreateUser = async() => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) {
      console.log("ERROR CREATING ACCOUNT", error);
    } else if (data) {
      console.log("Account created successfully", data.user);
    }
  }

  return (
    <>
        <div>
            <h1>Create Account</h1>
        </div>
        <div className='create_box'>
            <h2>Enter your email:</h2>
            <input type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h2>Enter a password:</h2>
            <input type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleCreateUser}>Create Account</button>
        </div>
    </>
  )
}
