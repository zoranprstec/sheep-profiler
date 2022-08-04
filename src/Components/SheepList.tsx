import { useEffect, useState, memo } from "react"
import { useDB, useFind} from "react-pouchdb"
import { Link } from "react-router-dom"
import "./SheepList.css"

export interface entryTypes {
    doc: docTypes,
    id: string,
    key: string,
    value: object
}

export interface docTypes {
    _id: string,
    _rev: string,
    name: string,
    description: string,
    dateOfBirth: Date,
    sex: string,
    status: string,
    dateOfEvent: Date,
    additionalNotes: string,
    _attachments: {
        ["sheeppic.jpg"]: {
            content_type: string,
            data: string,
            digest: string
        }
    }
}

interface SheepListProps {
    editSheep: (arg1: docTypes) => void
}

function SheepList(props: SheepListProps) {
    const [sheepArray, setSheepArray] = useState<Array<entryTypes>>([]) 
    const [renderTrigger, setRenderTrigger] = useState(0)
    const db = useDB('sheep_database')

    /**
     * TODO:
     * 
    */ 

    useEffect(() => {
        db.allDocs({
            include_docs: true,
            attachments: true,
            startKey: 2
        }).then((result: any) => {
            console.log(result)
            const filteredResults = result.rows.filter((entry: any) => !entry.id.includes("_design"))
            setSheepArray(filteredResults)
        }).catch((err: any) => {
            console.log(err);
        })
    }, [db, renderTrigger])

    function removeSheep(doc: any) {
        if (window.confirm('Are you sure?')) {
            db.remove(doc)
            setRenderTrigger(prev => prev + 1)
          } else {
            console.log("Removal canceled")
        }
    }
    
    const sheepListed = sheepArray.map((sheep: entryTypes) => {
        return (
            <Link to={`/sheep-manager/${sheep.doc._id}`} key={sheep.doc._id}>
                <li>
                    <img width={"100px"} alt="sheepic" src={`data:image/jpeg;base64,${sheep.doc._attachments["sheeppic.jpg"].data}`}></img>
                    <p>{sheep.doc.name}</p>
                    <p>{new Date(sheep.doc.dateOfBirth).toLocaleDateString()}</p>
                    <p>{sheep.doc.description}</p>
                    <button onClick={() => removeSheep(sheep.doc)}>Remove</button>
                    <button onClick={() => props.editSheep(sheep.doc)}>Edit</button>
                </li>
            </Link>
    )})
    
    // console.log("SheepList rendered: " + sheepArray[0])
    return (
        <div>
            <ul className="sheep">
                {sheepListed}
            </ul>
        </div>
    )
}

export default memo(SheepList)