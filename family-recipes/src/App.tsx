// import { useState } from 'react'
import './App.css'
// import { useEffect } from "react";
// import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";



function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<div>Recipes</div>} />
        <Route path="/meal-plan" element={<div>Meal Plan</div>} />
        <Route path="/kitchen" element={<div>Kitchen</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
