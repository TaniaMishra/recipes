// import { useState } from 'react'
import './App.css'
// import { useEffect } from "react";
// import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Recipes from './components/Recipes';
import AddRecipe from './components/AddRecipe';
import Kitchen from './components/Kitchen';
import MealPlan from './components/MealPlan';
import Profile from './components/Profile';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import ViewRecipe from './components/ViewRecipe';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/meal-plan" element={<MealPlan />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateUser />} />
        <Route path="/recipes/:recipeID" element={<ViewRecipe />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
