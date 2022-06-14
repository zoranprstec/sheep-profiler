import { SyntheticEvent, useEffect } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import "./Layout.css"

export default function Layout() {
    const location = useLocation()
    const navlinks = document.getElementsByClassName("navlink")
    
    useEffect(() => {
        var i = 0
        for (i = 0; i < navlinks.length; i++) {
            navlinks[i].className = navlinks[i].className.replace(" activelink", "")
            if (navlinks[i].id === location.pathname) {
                navlinks[i].className += " activelink"
            }
        }
    }, [location, navlinks])
    
    return (
        <div>
            <div className="navbar">
                <Link className="navlink" id="/" to="/">Home</Link>
                <Link className="navlink" id="/about" to="/about">About</Link>
                <Link className="navlink" id="/sheep-manager" to="/sheep-manager">Manager</Link>
            </div>
          <Outlet />
        </div>
    )
}