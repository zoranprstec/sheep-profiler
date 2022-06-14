import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/sheep-manager">Manage Sheep</Link></li>
          </ul>
          <Outlet />
        </div>
    )
}