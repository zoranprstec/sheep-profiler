import { Suspense, SyntheticEvent, useState, lazy, useEffect, useRef } from "react"
import { useDB } from "react-pouchdb"
import Calendar from "react-calendar"
import CalendarComp from "../Components/CalendarComp"
import Loading from "../Components/Loading"
import ShowCalendar from "../Functions/ShowCalendar"
import HideCalendar from "../Functions/HideCalendar"
import 'react-calendar/dist/Calendar.css'
import "./SheepManager.css"

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

// stranica na kojoj se uređuju podaci o ovci
export default function SheepManager() {
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: new Date(),
        description: "",
        sex: "female",
        status: "available",
        dateOfEvent: new Date()
    })
    const [attachment, setAttachment] = useState<string | ArrayBuffer | null>("")
    const [calendarProps, setCalendarProps] = useState("")
    const db = useDB('sheep_database')
    const dateRef = useRef<any>(null)

    useEffect(() => {
        window.addEventListener("click", HideCalendar)
        return () => {
            window.removeEventListener("click", HideCalendar)
        }
    }, [])

    // function handleBirthDate (event: Date) {
    //     setFormData(prevState => ({
    //         ...prevState,
    //         dateOfBirth: event
    //     }))
    // }

    // function handleEventDate (event: Date) {
    //     setFormData(prevState => ({
    //         ...prevState,
    //         dateOfEvent: event
    //     }))
    // }

    function handleChange(event: SyntheticEvent) {
        const {name, value, checked} = event.target as HTMLInputElement
        setFormData(prevState => ({
            ...prevState,
            [name]: value
            // [name]: checked ? value === "female" : value
        }))
    }

    function handleSubmit(event: SyntheticEvent) {
        db.put({
            _id: formData.name,
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            description: formData.description,
            isFemale: formData.sex,
            _attachments: {
                "sheeppic.jpg": {
                    content_type: "image/jpeg",
                    data: attachment?.slice(23)     // TODO: nešto robusnije od hardcoded slice(23)
                }
            }
        })
        .then(function (response: responseTypes) {
            console.log(response)
            window.location.reload()
        })
        .catch(function (err: any) {
            console.log(err)
            alert(err)                  // TODO: alert zamijeni s nečim ljepšim
        })
        
        event.preventDefault()
    }

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
                    value={formData.dateOfBirth.toDateString()}
                    onClick={handleCalendar}
                    placeholder="Date of birth"
                    name="dateOfBirth"
                    readOnly
                />
                {/* <Calendar className="calendar" value={formData.dateOfBirth} onChange={handleBirthDate} /> */}
                {/* <CalendarComp obj={{dateOfBirth: formData.dateOfBirth, setFormData: setFormData}} /> */}
                {/* <h1>hello</h1> */}

                <p>Sheep picture:</p>
                <input
                    type="file"
                    title="sheep pic"
                    onChange={fileChange}
                    required
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
                    value={formData.dateOfEvent.toDateString()}
                    onClick={handleCalendar}
                    placeholder="Date of event"
                    name="dateOfEvent"
                    readOnly
                />}
                {/* {additionalInfo && <CalendarComp obj={{dateOfEvent: formData.dateOfEvent, setFormData: setFormData}} />} */}

                <input
                    type="submit"
                    />
                {attachment && <img alt="what" src={attachment as string} width="200px"></img>}

            </form>
            <CalendarComp dateName={calendarProps} setFormData={setFormData} formData={formData} />
            <Suspense fallback={<Loading />}>
                <SheepList />
            </Suspense>
        </div>
    )
}

// 7-6-2022  