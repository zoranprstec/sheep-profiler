import { Suspense, SyntheticEvent, useState, lazy, useEffect } from "react"
import { useDB, useFind } from "react-pouchdb"
import Calendar from "react-calendar"
import Loading from "../Components/Loading"
import 'react-calendar/dist/Calendar.css'
import "./SheepManager.css"
import ShowCalendar from "../Functions/ShowCalendar"
import HideCalendar from "../Functions/HideCalendar"

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
        dateOfBirth: new Date(),
        description: ""
    })
    const db = useDB('sheep_database')

    useEffect(() => {
        window.addEventListener("click", HideCalendar)
        return () => {
            window.removeEventListener("click", HideCalendar)
        }
    }, [])


    function handleDate (event: Date) {
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
            dateOfBirth: formData.dateOfBirth,
            description: formData.description
        })
          .then(function (response: responseTypes) {
            console.log(response)
          })
          .catch(function (err: any) {
            console.log(err)
            alert(err)                  // TODO: alert zamijeni s nečim ljepšim
          })
        
        event.preventDefault()
    }

    return (
        <div className="manager">
            <form className="manager-form" onSubmit={handleSubmit}>
                <p>Sheep name:</p>
                <input
                    type="string"
                    placeholder="Sheep name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                <p>Sheep description:</p>
                <textarea 
                    placeholder="Sheep description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    />
                <p>Date of birth:</p>
                <input
                    type="string"
                    value={formData.dateOfBirth.toDateString()}
                    onClick={ShowCalendar}
                    placeholder="Date of birth"
                    readOnly
                    />
                <div className="modal" id="modal">
                    <Calendar className="calendar" value={formData.dateOfBirth} onChange={handleDate} />
                </div>
                <input
                    type="submit"
                    />
            </form>
            <Suspense fallback={<Loading />}>
                <SheepList />
            </Suspense>
        </div>
    )
}

// 7-6-2022  