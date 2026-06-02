// import { useState } from 'react'
import './App.css'
// import { useEffect } from "react";
// import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";


function App() {
  // const [count, setCount] = useState(0)

  // TEST DATABASE CONNECTION - WORKING!!
  // useEffect(() => {
  //   async function testConnection() {
  //     const { data, error } = await supabase
  //       .from("recipes")
  //       .select("*");

  //     console.log("Data", data);
  //     console.log("Error", error)
  //   }
  //   testConnection();
  // }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/recipes" element={<div>Recipes</div>} />
        <Route path="/meal-plan" element={<div>Meal Plan</div>} />
        <Route path="/kitchen" element={<div>Kitchen</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
