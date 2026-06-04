import { NavLink } from "react-router-dom";
import '../styles/Navbar.css'

export default function Navbar() {
    return (
        <nav>
            <div className="navbar">
                <div className="nav_pages">
                    <NavLink to="/"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            What's for dinner?
                    </NavLink>
                    <NavLink to="/recipes"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            Recipes
                    </NavLink>
                    <NavLink to="/meal-plan"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            Meal Plan
                    </NavLink>
                    <NavLink to="/kitchen"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            My Kitchen
                    </NavLink>
                </div>
                <div className="nav_profile">
                    <NavLink to="/my-profile"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            Profile
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}