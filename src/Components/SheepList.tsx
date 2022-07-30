import { useEffect, useState, memo } from "react"
import { useDB, useFind} from "react-pouchdb"
import "./SheepList.css"

interface entryTypes {
    doc: {
        _id: string,
        _rev: string,
        name: string,
        description: string,
        dateOfBirth: string,
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
    },
    id: string,
    key: string,
    value: object
}

function SheepList() {
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
            attachments: true
        }).then((result: any) => {
            const filteredResults = result.rows.filter((entry: any) => !entry.id.includes("_design"))
            setSheepArray(filteredResults)
        }).catch((err: any) => {
            console.log(err);
        })
    }, [db, renderTrigger])

    function removeSheep(doc: any) {
        db.remove(doc)
        setRenderTrigger(prev => prev + 1)
    }
    
    const sheepListed = sheepArray.map((sheep: entryTypes) => {
        return (
            <li key={sheep.doc._id}>
            <img width={"100px"} alt="sheepic" src={`data:image/jpeg;base64,${sheep.doc._attachments["sheeppic.jpg"].data}`}></img>
            <p>{sheep.doc.name}</p>
            <p>{new Date(sheep.doc.dateOfBirth).toLocaleDateString()}</p>
            <p>{sheep.doc.description}</p>
            <button onClick={() => removeSheep(sheep.doc)}>Remove</button>
        </li>
    )})
    
    // console.log("SheepList rendered: " + sheepArray[0])
    return (
        <div>
            <ul className="sheep">
                {sheepListed}
            </ul>
            <div className="prompt">
                <h2 className="prompt-title">Confirm choice</h2>
                <p className="prompt-text">
                    Are you sure you want to delete this animal? This process cannot be reversed.
                </p>
                <div className="prompt-button-container">
                    <button className="prompt-button">Yes</button>
                    <button className="prompt-button">No</button>
                </div>
            </div>
        </div>
    )
}

export default memo(SheepList)