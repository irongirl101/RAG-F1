"use client"
import Image from "next/image"
import f1 from "./assets/f1.jpeg"
import {useChat} from "ai/react"
import {message} from "ai"

const Home = ()=>{
  return(
  <main>
    <Image src = {f1} width="250" alt = "logo"/>
  </main>)
}

export default Home