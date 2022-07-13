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

function SheepList() {
    const [src, setSrc] = useState([""])
    const [sheepArray, setSheepArray] = useState([]) 
    const [sheepNode, setSheepNode] = useState([])
    const db = useDB('sheep_database')

    /**
     * TODO:
     * - [X] useFind se izvrši svaki put kad imamo re-render, izvrši samo kad se promijeni "db"
     * - [X] db.getAttachment izvrti preko "for each" na sheepList i onda rezultat priključi na
     *      state u kojem se drži sheepList
     * - [ ] istraži nešto kao db.updated, neka metoda koja se izvršavva kad se db updejta
     *      možda db slati u ovu komponentu kao prop?
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

    const sheepList = useFind(db, {
        selector: {
            name: { $gte: null }      // $gte znači "greater than or equal"; pronalazi sve entryje
        },
        sort: ["name"],
        attachments: true
    })
    
    if (sheepList.length > 0) {
        for (const sheep of sheepList) {

            db.getAttachment(sheep._id, "sheeppic.jpg")
            .then((blob: any) => {
                var reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = () => {
                    Object.defineProperty(sheep, 'picture', {
                        value: reader.result as string
                    })}
                })
            .catch((err: any) => {
                console.log(err)
            })
        }
    }

    useEffect(() => {
        setSheepArray(sheepList)
        console.log("sheepArray set")
    }, [db])


    // console.log(sheepArray)
    
    // Ovo ne ide u useEffect, jer je ovo "useFind"; hooks ne smijemo stavljati u callback.
    // Hooks moraju biti Top level.
    
    // useEffect(() => {
    //     setSheepArray(sheepList)
    // }, [])
    
    const sheepListed = sheepArray.map((sheep: sheepTypes) => {
        return (
            <li key={sheep._id}>
            <img width={"100px"} alt="sheepic" src={sheep.picture}></img>
            <p>{sheep.name}</p>
            <p>{new Date(sheep.dateOfBirth).toLocaleDateString()}</p>
            <p>{sheep.description}</p>
            <button onClick={() => db.remove(sheep)}>Remove</button>
        </li>
    )})

    console.log("SheepList component rendered")
    
    return (
        <ul className="sheep">
            {sheepListed}
        </ul>
    )
}

export default memo(SheepList)