import { useEffect, useState, memo } from "react"
import { useDB, useFind} from "react-pouchdb"
import "./SheepList.css"

interface entryTypes {
    doc: {
        _id: string,
        _rev: string,
        dateOfBirth: string,
        description: string,
        name: string
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
     * - [X] useFind se izvrši svaki put kad imamo re-render, izvrši samo kad se promijeni "db"
     * - [X] db.getAttachment izvrti preko "for each" na sheepList i onda rezultat priključi na
     *      state u kojem se drži sheepList
     * - [ ] istraži nešto kao db.updated, neka metoda koja se izvršavva kad se db updejta
     *      možda db slati u ovu komponentu kao prop?
     * -> postoji db.changes(options) koji stvara event listener koji izvršava kod kad detektira promjene
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
    
    // console.log("SheepList rendered: " + sheepArray[0])

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

    return (
        <ul className="sheep">
            {sheepListed}
        </ul>
    )
}

export default memo(SheepList)