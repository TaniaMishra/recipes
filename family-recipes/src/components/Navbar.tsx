import { NavLink } from "react-router-dom";
import '../styles/Navbar.css'

export default function Navbar() {
    return (
        <nav>
            <div className="navbar">
                <div className="nav_pages">
                    <NavLink to="/"
                        className={({ isActive }) => isActive ? "text-black font-semibold" : "hover:text-black"}>
                            Family Recipes
                    </NavLink>
                    <NavLink to="/recipes"
                        className={({ isActive }) => isActive ? "text-black font-semibold" : "hover:text-black"}>
                            Recipes
                    </NavLink>
                    <NavLink to="/meal-plan"
                        className={({ isActive }) => isActive ? "text-black font-semibold" : "hover:text-black"}>
                            Meal Plan
                    </NavLink>
                    <NavLink to="/kitchen"
                        className={({ isActive }) => isActive ? "text-black font-semibold" : "hover:text-black"}>
                            My Kitchen
                    </NavLink>
                </div>
                <div className="nav_profile">
                    <NavLink to="/"
                        className={({ isActive }) => isActive ? "text-black font-semibold" : "hover:text-black"}>
                            Profile
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}