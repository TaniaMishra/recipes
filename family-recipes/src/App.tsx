import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoute';
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
        <Route path="/meal-plan" element={
          <ProtectedRoute>
            <MealPlan />
          </ProtectedRoute>
        } />
        <Route path="/kitchen" element={
          <ProtectedRoute>
            <Kitchen />
          </ProtectedRoute>
        } />
        <Route path="/add-recipe" element={
          <ProtectedRoute>
            <AddRecipe />
          </ProtectedRoute>
          }/>
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateUser />} />
        <Route path="/recipes/:recipeID" element={<ViewRecipe />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
