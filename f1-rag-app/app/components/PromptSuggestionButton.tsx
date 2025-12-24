import { text } from "stream/consumers"

const PromptSuggestionButton = ({text, onClick}) =>{
    return(
    <button className="promptButton" onClick={onClick}>
        {text}
    </button>
)
}

export default PromptSuggestionButton