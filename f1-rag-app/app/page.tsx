"use client";

import Image from "next/image";
import f1 from "./assets/f1.webp";
import { useChat } from "@ai-sdk/react";
import Bubbles from "./components/bubbles";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/chat",
    streamMode:"text"
  });

  const noMessages = messages.length === 0;
  console.log(messages)
  return (
    <main>
      <Image src={f1} width={250} alt="logo" />

      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Testing out a F1 RAG using Gemini API
            </p>
            <PromptSuggestionsRow
              onPromptClick={(prompt) => {
                handleSubmit(undefined, {
                  data: { prompt },
                });
              }}
            />
          </>
        ) : (
          <>
            {messages.map((message) => (
              <Bubbles key={message.role} message={message.content} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="question-box"
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any F1 question"
          />
          <input type="submit" />
        </form>
      </section>
    </main>
  );
}
