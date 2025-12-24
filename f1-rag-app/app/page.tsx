"use client"
import Image from "next/image"
import f1 from "./assets/f1.webp"
import {useChat} from "@ai-sdk/react" // this is a webhooke
import {Message} from "ai"

const Home = ()=>{
  const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()
  const noMessages = true
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
        {/*PromptSuggestionRow */}
      </>):
      (<>
        {/*map messages to text bubbles*/}
        {/*loading bubble */}
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