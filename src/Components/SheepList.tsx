import { useDB, useFind } from "react-pouchdb"
import "./SheepList.css"

export default function SheepList() {
    const db = useDB('sheep_database')

    const sheepList = useFind(db, {
        selector: {
            name: { $gte: null }      // $gte znači "greater than or equal"; pronalazi sve entryje
        },
        sort: ["name"]
    })
      .map((sheep: any) => (
        <li key={sheep._id}>
            <p>{sheep.name}</p>
            <p>{sheep.dateOfBirth}</p>
            <p>{sheep.description}</p>
            <button onClick={() => db.remove(sheep)}>Remove</button>
        </li>
    ))

    return (
        <ul className="sheep">
            {sheepList}
        </ul>
    )
}