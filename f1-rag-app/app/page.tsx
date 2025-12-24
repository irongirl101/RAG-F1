"use client"
import Image from "next/image"
import f1 from "./assets/f1.webp"
import { useChat } from "@ai-sdk/react"; // this is a webhooke
import Bubbles from "./components/bubbles"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"
import LoadingBubble from "./components/LoadingBubble"
import { Message } from "ai";

const Home = ()=>{
  const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()
  const noMessages = false
  const handlePrompt = (promptText: string)=>{
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }
    append(msg)
  }
  return(
  <main>
    <Image src = {f1} width="250" alt = "logo"/>
    <section className = {noMessages?" ": "populated"}>
      {noMessages?(
      <>
        <p className="starter-text">
          Testing out a F1 Rag using Gemini API
        </p>
        <br/>
        <PromptSuggestionsRow onPromptClick={handlePrompt}/>
      </>):
      (<>
        {messages.map((message,index)=><Bubbles key={`message-${index}`}message={message}/>)}
        {isLoading && <LoadingBubble/>}
      </>)
      }
      <form onSubmit={handleSubmit}>
        <input className= "question-box" type = "text" onChange={handleInputChange} value={input} placeholder="Ask any F1 question"></input>
        <input type = "submit"></input>
      </form>
    </section>
  </main>
  )
}

export default Home