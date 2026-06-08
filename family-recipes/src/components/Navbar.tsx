import { NavLink } from "react-router-dom";
import '../styles/Navbar.css'
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const { user } = useAuth();

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
                    {user ? 
                        (<NavLink to="/meal-plan"
                            className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                                Meal Plan
                        </NavLink>)
                        : <></>
                    }
                    {user ?
                        (<NavLink to="/kitchen"
                            className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                                My Kitchen
                        </NavLink>)
                        : <></>
                    }
                </div>
                <div className="nav_profile">
                    {user ? 
                        (<NavLink to="/my-profile"
                            className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                                Profile
                        </NavLink>)
                        : (<NavLink to="/login"
                            className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                                Login
                        </NavLink>)
                    }
                </div>
            </div>
        </nav>
    )
}