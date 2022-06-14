import { useDB, useFind } from "react-pouchdb"

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
            {sheep.name} | {sheep.dateOfBirth}
            <button onClick={() => db.remove(sheep)}>Remove</button>
        </li>
    ))

    return (
        <ul>
            {sheepList}
        </ul>
    )
}