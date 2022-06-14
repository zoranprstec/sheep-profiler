import { Suspense, SyntheticEvent, useState, lazy } from "react"
import { useDB, useFind } from "react-pouchdb"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

const SheepList = lazy(() => import("../Components/SheepList"))

interface sheepTypes {
    name: string
    dateOfBirth: Date
}

interface responseTypes {
    id: string
    ok: boolean
    rev: string
}

// stranica na kojoj se uređuju podaci o ovci
export default function SheepManager() {
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: new Date()
    })
    const db = useDB('sheep_database')

    function handleDate (event: Date) {
        console.log(event)
        setFormData(prevState => ({
            ...prevState,
            dateOfBirth: event
        }))
    }

    function handleChange(event: SyntheticEvent) {
        const {name, value} = event.target as HTMLInputElement
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    function handleSubmit(event: SyntheticEvent) {
        db.put({
            _id: formData.name,
            name: formData.name,
            dateOfBirth: formData.dateOfBirth
        })
          .then(function (response: responseTypes) {
              console.log(response)
          })
          .catch(function (err: any) {
          console.log(err)
          alert(err)        // TODO: alert zamijeni s nečim ljepšim
          })
        
        event.preventDefault()
    }

    const sheepList = useFind(db, {
        selector: {
            name: { $gte: null }      // $gte znači "greater than or equal"; pronalazi sve entryje
        },
        sort: ["name"]
    }).map((sheep: any) => (
        <li key={sheep._id}>
            {sheep.name} | {sheep.dateOfBirth}
            <button onClick={() => db.remove(sheep)}>Remove</button>
        </li>
    ))

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="string"
                    placeholder="Sheep name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Calendar value={formData.dateOfBirth} onChange={handleDate} />
                <input
                    type="submit"
                />
            </form>
            <Suspense fallback={<h1>Loading...</h1>}>
                <SheepList />
            </Suspense>
        </div>
    )
}

// 7-6-2022  