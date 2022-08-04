import { Suspense, SyntheticEvent, useState, lazy, useEffect, useRef } from "react"
import { useDB } from "react-pouchdb"
import { Outlet } from "react-router-dom"
import CalendarComp from "../Components/CalendarComp"
import Loading from "../Components/Loading"
import ShowCalendar from "../Functions/ShowCalendar"
import HideCalendar from "../Functions/HideCalendar"
import 'react-calendar/dist/Calendar.css'
import "./SheepManager.css"
import { docTypes } from "../Components/SheepList"

const SheepList = lazy(() => import("../Components/SheepList"))

/**
 * TODO:
 * - [X] Zašto imamo 2 rendera na SheepManager?
 *      -no fucking idea
 */

interface responseTypes {
    id: string
    ok: boolean
    rev: string
}

interface formDataTypes {
    name: string,
    dateOfBirth: Date|string,
    description: string,
    sex: string,
    status: string,
    dateOfEvent: Date|string,
    additionalNotes: string
}

// stranica na kojoj se uređuju podaci o ovci
export default function SheepManager() {
    const [formData, setFormData] = useState<formDataTypes>({
        name: "",
        dateOfBirth: new Date(),
        description: "",
        sex: "female",
        status: "available",
        dateOfEvent: new Date(),
        additionalNotes: ""
    })
    const [attachment, setAttachment] = useState<string | ArrayBuffer | null>("")
    const [calendarProps, setCalendarProps] = useState("")
    const db = useDB('sheep_database')
    const dateRef = useRef<any>(null)

    const sheepDoc = {
        _id: formData.name,
        name: formData.name,
        // dateOfBirth: Date.parse(formData.dateOfBirth as string),
        dateOfBirth: formData.dateOfBirth as string,
        description: formData.description,
        sex: formData.sex,
        status: formData.status,
        // dateOfEvent: Date.parse(formData.dateOfEvent as string),
        dateOfEvent: formData.dateOfEvent,
        additionalNotes: formData.additionalNotes,
        _attachments: {
            "sheeppic.jpg": {
                content_type: "image/jpeg",
                data: attachment?.slice(23)     // TODO: nešto robusnije od hardcoded slice(23)
            }
        }
    }

    useEffect(() => {
        window.addEventListener("click", HideCalendar)
        return () => {
            window.removeEventListener("click", HideCalendar)
        }
    }, [])

    function handleChange(event: SyntheticEvent) {
        const {name, value, checked} = event.target as HTMLInputElement
        setFormData(prevState => ({
            ...prevState,
            [name]: value
            // [name]: checked ? value === "female" : value
        }))
    }

    function editSheep(doc: docTypes) {
        setFormData({
            name: doc.name,
            dateOfBirth: new Date(doc.dateOfBirth),
            description: doc.description,
            sex: doc.sex,
            status: doc.status,
            dateOfEvent: new Date(doc.dateOfEvent),
            additionalNotes: doc.additionalNotes,
        })
    }

    function handleSubmit(event: SyntheticEvent) {

        db.get(formData.name)
        .then((doc: any) => {
            if (window.confirm(`Update ${doc._id}?`)) {
            db.put({
                _rev: doc._rev,
                ...sheepDoc
            })
            .then(function (response: responseTypes) {
                window.location.reload()
            })
            .catch(function (err: any) {
                console.log(err)
                alert(err)                  // TODO: alert zamijeni s nečim ljepšim
            })}
        })
        .catch((err: any) => {
            if(err.status === 404) {
                db.put({
                    ...sheepDoc
                })
                .then(function (response: responseTypes) {
                    window.location.reload()
                })
                .catch(function (err: any) {
                    console.log(err)
                    alert(err)                  // TODO: alert zamijeni s nečim ljepšim
                })
            } else {
                console.log(err)
            }
        })
        
        event.preventDefault()
    }
    
    // function updateDB() {
    //     db.put({
    //         _rev: doc_rev,
    //         ...sheepDoc
    //     })
    //     .then(function (response: responseTypes) {
    //         console.log(response)
    //         window.location.reload()
    //     })
    //     .catch(function (err: any) {
    //         console.log(err)
    //         alert(err)                  // TODO: alert zamijeni s nečim ljepšim
    //     })
    // }

    function toBase64(file: File) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setAttachment(reader.result as string)
        }
        reader.onerror = err => {
            console.log("Error: " + err)
        }
    }

    function fileChange(event: any) {
        event.target.files[0] && toBase64(event.target.files[0])
    }

    function handleCalendar(event: SyntheticEvent) {
        const {name} = event.target as HTMLInputElement
        setCalendarProps(name)
        ShowCalendar()
    }

    // console.log("SheepManager rendered")

    const additionalInfo = formData.status === "sold" || formData.status === "dead"

    return (
        <div className="manager">
            <form className="manager-form" onSubmit={handleSubmit}>

                <p>Sheep name:</p>
                <input
                    type="string"
                    placeholder="Npr. Franka"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <p>Sheep description:</p>
                <textarea 
                    placeholder="Npr. boja dlake, specifične šare, veličina..."
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <p>Date of birth:</p>
                <input
                    type="string"
                    value={(formData.dateOfBirth as Date).toDateString()}
                    onClick={handleCalendar}
                    placeholder="Date of birth"
                    name="dateOfBirth"
                    readOnly
                />

                <p>Sheep picture:</p>
                <input
                    type="file"
                    title="sheep pic"
                    onChange={fileChange}
                    // required
                />

                <p>Sheep sex: </p>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="female"
                            checked={formData.sex === "female"}
                            onChange={handleChange}
                            name="sex"
                        />
                        Žensko
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="male"
                            checked={formData.sex === "male"}
                            onChange={handleChange}
                            name="sex"
                        />
                        Muško
                    </label>
                </div>

                <p>Status of sheep: </p>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="available"
                            checked={formData.status === "available"}
                            onChange={handleChange}
                            name="status"
                        />
                        Kod nas
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="sold"
                            checked={formData.status === "sold"}
                            onChange={handleChange}
                            name="status"
                        />
                        Prodana
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="dead"
                            checked={formData.status === "dead"}
                            onChange={handleChange}
                            name="status"
                        />
                        Uginula ili zaklana
                    </label>
                </div>

                {additionalInfo && <p>Date of event: </p>}
                {additionalInfo && 
                <input
                    type="string"
                    value={(formData.dateOfEvent as Date).toDateString()}
                    onClick={handleCalendar}
                    placeholder="Date of event"
                    name="dateOfEvent"
                    readOnly
                />}
                {additionalInfo && <p>Notes on event: </p>}
                {additionalInfo && 
                <textarea 
                    placeholder="Dodatne bilješke o događaju"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                />}

                <input
                    type="submit"
                    />
                {attachment && <img alt="what" src={attachment as string} width="200px"></img>}

            </form>
            <Outlet />
            <CalendarComp dateName={calendarProps} setFormData={setFormData} formData={formData} />
            <Suspense fallback={<Loading />}>
                <SheepList editSheep={editSheep} />
            </Suspense>
        </div>
    )
}

// 7-6-2022  

// ♀ ♂