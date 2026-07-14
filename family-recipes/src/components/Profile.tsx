// import { useState } from 'react'
import '../styles/Profile.css'
import { supabase } from "../lib/supabase";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Profile() {
  const nav = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };
  return (
    <>
        <div>
            <h1>Profile</h1>
            <p>Email: {user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
        <div>
          {/* TODO: add must have items: text box (like the tag text box in add recipes) */}
        </div>
    </>
  )
}
