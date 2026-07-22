import { NavLink } from "react-router-dom";
import '../styles/Navbar.css'
import { useAuth } from "../hooks/useAuth";
import ProtectedNavLink from "./ProtectedNavLink";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav>
            <div className="navbar">
                <div className="nav_pages">
                    <ProtectedNavLink to="/"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            What's for dinner?
                    </ProtectedNavLink>
                    <ProtectedNavLink to="/recipes"
                        className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                            Recipes
                    </ProtectedNavLink>
                    {user ? 
                        (<ProtectedNavLink to="/meal-plan"
                            className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                                Meal Plan
                        </ProtectedNavLink>)
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
                        (<ProtectedNavLink to="/my-profile"
                            className={({ isActive }) => isActive ? 'nav_active' : 'nav_inactive'}>
                                Profile
                        </ProtectedNavLink>)
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