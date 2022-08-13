export interface responseTypes {
    id: string
    ok: boolean
    rev: string
}

export interface formDataTypes {
    name: string,
    dateOfBirth: Date|string,
    description: string,
    sex: string,
    status: string,
    dateOfEvent: Date|string,
    additionalNotes: string
}

export interface CalendarCompProps {
    dateName: string,
    setFormData: (arg1: any) => void,
    formData: any
}

//  Types returned from .allDocs() method
export interface allDocsTypes {
    offset: number,
    rows: Array<entryTypes>,
    total_rows: number
}

//  Types of every entry from .allDocs() method
export interface entryTypes {
    doc: docTypes,
    id: string,
    key: string,
    value: object
}

//  Types of a doc from pouchdb database
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