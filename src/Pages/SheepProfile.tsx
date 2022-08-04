import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDB } from "react-pouchdb"
import { docTypes, entryTypes } from "../Components/SheepList"

export function SheepProfile() {
    // const [sheep, setSheep] = useState<docTypes>()
    const [sheep, setSheep] = useState<entryTypes>()
    const params = useParams()
    const db = useDB('sheep_database')

    useEffect(() => {
        // db.get(params.sheepId)
        // .then((doc: docTypes) => {
        //     setSheep(doc)
        // })
        // .catch((err: any) => {
        //     console.log(err)
        // })

        db.allDocs({
            include_docs: true,
            attachments: true,
            key: params.sheepId
        })
        .then((res: any) => {
            console.log(res)
        })
        .catch((err: any) => {
            console.log(err)
        })
    }, [])

    return (
        <h1>Sheep id: {}</h1>
    )
}