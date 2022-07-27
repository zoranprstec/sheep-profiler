import { Suspense, SyntheticEvent, useState, lazy, useEffect } from "react"
import { useDB } from "react-pouchdb"
import Calendar from "react-calendar"
import Loading from "../Components/Loading"
import ShowCalendar from "../Functions/ShowCalendar"
import HideCalendar from "../Functions/HideCalendar"
import { read } from "fs"
import 'react-calendar/dist/Calendar.css'
import "./SheepManager.css"

const SheepList = lazy(() => import("../Components/SheepList"))

/**
 * TODO:
 * - [X] Zašto imamo 2 rendera na SheepManager?
 *      -no fucking idea
 */

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
    const [attachment, setAttachment] = useState<string | ArrayBuffer | null>("")
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
            description: formData.description,
            _attachments: {
                "sheeppic.jpg": {
                    content_type: "image/jpeg",
                    data: attachment?.slice(23)
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
    
    // function printFile(file: File) {
    //     const reader = new FileReader();
    //     reader.onload = function(evt) {
    //         console.log(evt.target.result);
    //     };
    //     reader.readAsText(file);
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

    // console.log("SheepManager rendered")

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
                    onClick={ShowCalendar}
                    placeholder="Date of birth"
                    readOnly
                    />
                <div className="modal" id="modal">
                    <Calendar className="calendar" value={formData.dateOfBirth} onChange={handleDate} />
                </div>
                <p>Sheep picture:</p>
                <input
                    type="file"
                    title="sheep pic"
                    onChange={fileChange}
                    required
                />
                <input
                    type="submit"
                    />
                {attachment && <img alt="what" src={attachment as string} width="200px"></img>}
            </form>
            <Suspense fallback={<Loading />}>
                <SheepList />
            </Suspense>
        </div>
    )
}

// 7-6-2022  