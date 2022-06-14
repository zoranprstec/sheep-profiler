import { useDB, useFind } from "react-pouchdb"
import { Link } from "react-router-dom"

export default function Home() {
    const db = useDB('sheep_database')

    const docs = useFind(db, {
        selector: {
          name: { $gte: null }
        },
        sort: ["name"]
    })

    // const sheepList = docs.map(sheep => 
    //     <li>
    //         {sheep.name}: blee
    //     </li>
    // )

    return (
        <div className="App">
            <Link to="/sheep-manager">New Sheep</Link>
            <h1>Hello sheep</h1>
        </div>
    )
}
