import { title } from "process"
import "./assets/globals.css"
import { Children } from "react"

export const metadata = {
  title: "F1RAG",
  description : "F1 rag stuff"
}

const rootLayout = ({children}) => {
  return(
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

export default rootLayout