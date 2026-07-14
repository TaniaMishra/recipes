import { useNavigate } from "react-router-dom";
import { useKitchen } from "../context/KitchenContext";
import { NavLink } from "react-router-dom";

interface Props {
    to: string;
    children: React.ReactNode;
    className?: (
        props: { isActive: boolean }
    ) => string;
}

export default function ProtectedNavLink({ to, children, className } : Props) {
  const navigate = useNavigate();
  const { dirty, setDirty } = useKitchen();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {

    if (dirty) {
      const confirmLeave = window.confirm(
        "You have unsaved kitchen changes. Leave anyway?"
      );

      if (!confirmLeave) {
        e.preventDefault();
        return;
      }
    }

    setDirty(false);
    navigate(to);
  };


  return (
    <NavLink
        to={to}
        onClick={handleClick}
        className={className}
    >
        {children}
    </NavLink>
  );
}