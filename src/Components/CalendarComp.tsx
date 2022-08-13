import Calendar from "react-calendar"
import HideCalendar from "../Functions/HideCalendar"
import { CalendarCompProps } from "../Types"


export default function CalendarComp({dateName, setFormData, formData}: CalendarCompProps) {
    // console.log(`DateOfBirth: ${dateOfBirth}\nDateOfEvent: ${dateOfEvent}`)
    // console.log(`date: ${date}\ndateValue: ${dateValue}`)

    function handleDate(event: Date) {
        setFormData((prevState: any) => ({
            ...prevState,
            [dateName]: event
        }))
        HideCalendar()
    }

    return (
        <div className="modal" id="modal">
            <Calendar className="calendar" value={formData[dateName]} onChange={handleDate} />
        </div>
    )
}