import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({onPromptClick}) =>{
    const prompts = [
        "Who is the current team principal for Red Bull Racing?",
        "How many races did Max Verstappen win in 2023?",
        "Who is the current Formula One world Champion?", 
        "Who is the newest driver for Ferrari?"
    ]

    return(<div className="prompt-suggestion-row">
        {prompts.map((prompt,index)=> <PromptSuggestionButton key={`suggestion-${index}`} text={prompt} onClick={()=>onPromptClick(prompt)}/>)}
    </div>)
}

export default PromptSuggestionsRow