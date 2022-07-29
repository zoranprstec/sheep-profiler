export default function HideCalendar(event: MouseEvent) {
    const modal = document.getElementById("modal")
    if (modal && event.target == modal) {
        modal.style.display = "none"
    }
}