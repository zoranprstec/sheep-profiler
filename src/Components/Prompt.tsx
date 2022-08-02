

export default function Prompt() {
    return (
        <div className="prompt">
            <h2 className="prompt-title">Confirm choice</h2>
            <p className="prompt-text">
                Are you sure you want to delete this animal? This process cannot be reversed.
            </p>
            <div className="prompt-button-container">
                <button className="prompt-button">Yes</button>
                <button className="prompt-button">No</button>
            </div>
        </div>
    )
}