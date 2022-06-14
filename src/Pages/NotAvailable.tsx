import React from "react"
import { Link } from "react-router-dom"

export default function NotAvailable() {
    return (
        <div>
            <h1>The route does not exist</h1>
            <Link to="/">Back</Link>
        </div>
    )
}