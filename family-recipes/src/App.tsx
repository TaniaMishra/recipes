// import { useState } from 'react'
import './App.css'
// import { useEffect } from "react";
// import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Recipes from './components/Recipes';
import AddRecipe from './components/AddRecipe';


function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/meal-plan" element={<div>Meal Plan</div>} />
        <Route path="/kitchen" element={<div>Kitchen</div>} />
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
