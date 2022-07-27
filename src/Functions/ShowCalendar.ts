export default function ShowCalendar(props: any) {
    const modal = document.getElementById("modal") || document.getElementById("modal-add")
    if (modal) {
        modal.style.display = "block"
    }
}