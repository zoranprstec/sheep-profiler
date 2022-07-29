import Calendar from "react-calendar"

interface CalendarCompProps {
    // obj: {
    //     dateOfBirth?: Date,
    //     dateOfEvent?: Date,
    //     setFormData: (arg1: any) => void
    // }
    dateName: string,
    setFormData: (arg1: any) => void,
    formData: any
}

export default function CalendarComp({dateName, setFormData, formData}: CalendarCompProps) {
    // const {dateOfBirth, dateOfEvent, setFormData} = obj

    // const date = dateOfBirth ? "dateOfBirth" : "dateOfEvent"
    // const dateValue = dateOfBirth ? dateOfBirth : dateOfEvent
    
    // console.log(`DateOfBirth: ${dateOfBirth}\nDateOfEvent: ${dateOfEvent}`)
    // console.log(`date: ${date}\ndateValue: ${dateValue}`)

    function handleDate(event: Date) {
        setFormData((prevState: any) => ({
            ...prevState,
            [dateName]: event
        }))
    }

    return (
        <div className="modal" id="modal">
            <Calendar className="calendar" value={formData[dateName]} onChange={handleDate} />
        </div>
    )
}