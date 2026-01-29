import "./BackButton.css"



export default function MyBackButton({children}) {
    function handleClick(){
        window.history.back()
    }

    return <button onClick={handleClick} className="my-back-button">{children}</button>
}