import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDB } from "react-pouchdb"
import { allDocsTypes, entryTypes } from "../Types"

export function SheepProfile() {
    // const [sheep, setSheep] = useState<docTypes>()
    const [sheep, setSheep] = useState<entryTypes>()
    const params = useParams()
    const db = useDB('sheep_database')

    useEffect(() => {
        db.allDocs({
            include_docs: true,
            attachments: true,
            key: params.sheepId
        })
        .then((res: allDocsTypes) => {
            setSheep(res.rows[0])
        })
        .catch((err: any) => {
            console.log(err)
        })
    }, [])

    if(sheep) {
        const {doc} = sheep
        const {name, description} = doc
        return (
            <div>
                <div>
                    <img src="#" alt="Sheep smiling" />
                    <div>
                        <h1>{name}</h1>
                        <h2>{description}</h2>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>There's nothing here</h1>
            </div>
        )
    }
}
// {/* <h1>Sheep id: {sheep?.doc._id}</h1> */}