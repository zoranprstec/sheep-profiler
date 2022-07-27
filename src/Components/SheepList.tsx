import { useEffect, useState, memo } from "react"
import { useDB, useFind} from "react-pouchdb"
import "./SheepList.css"

interface sheepTypes {
    _id: string,
    name: string,
    dateOfBirth: string,
    description: string,
    picture: string
}

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
    const [src, setSrc] = useState([""])
    const [sheepArray, setSheepArray] = useState<Array<entryTypes>>([]) 
    const [sheepNode, setSheepNode] = useState([])
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
    
    // db.getAttachment("Franka", "sheep-pic.jpg")
    // .then((blob: any) => {
    //     console.log(blob)
    //     let url = URL.createObjectURL(blob)
    //     setSrc(url)
    // })
    // .catch((err: any) => {
    //     console.log(err)
    // })

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

    // const sheepList = useFind(db, {
    //     selector: {
    //         name: { $gte: null }      // $gte znači "greater than or equal"; pronalazi sve entryje
    //     },
    //     sort: ["name"],
    //     attachments: true
    // })
    
    // if (sheepList.length > 0) {
    //     for (const sheep of sheepList) {

    //         db.getAttachment(sheep._id, "sheeppic.jpg")
    //         .then((blob: any) => {
    //             var reader = new FileReader();
    //             reader.readAsDataURL(blob); 
    //             reader.onloadend = () => {
    //                 Object.defineProperty(sheep, 'picture', {
    //                     value: reader.result as string
    //                 })}
    //             })
    //         .catch((err: any) => {
    //             console.log(err)
    //         })
    //     }
    // }

    // data:image/jpeg;base64,

    // useEffect(() => {
    //     setSheepArray(sheepList)

    //     let changes = db.changes({
    //         since: 'now',
    //         live: true,
    //         include_docs: true
    //     }).on('change', function(change: any) {
    //         console.log(change)
    //         // handle change
    //     }).on('complete', function(info: any) {
    //         // changes() was canceled
    //     }).on('error', function (err: any) {
    //         console.log(err);
    //     });

    //     return (
    //         changes.cancel()
    //     )
    // }, [])

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