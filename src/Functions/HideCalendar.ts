export default function HideCalendar(event: MouseEvent) {
    const modal = document.getElementById("modal") || document.getElementById("modal-add")
    if (modal && event.target == modal) {
        modal.style.display = "none"
    }
}