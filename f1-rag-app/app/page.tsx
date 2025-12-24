"use client";

import Image from "next/image";
import f1 from "./assets/f1.webp";
import { useChat } from "@ai-sdk/react";
import Bubbles from "./components/bubbles";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import LoadingBubble from "./components/LoadingBubble";

const Home = () => {
  const {
    append,
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat({ api: "/api/chat" });

  const noMessages = messages.length === 0;

  const handlePrompt = (promptText: string) => {
    append({
      role: "user",
      content: promptText,
    });
    handleSubmit();
  };

  return (
    <main>
      <Image src={f1} width={250} alt="logo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Testing out a F1 RAG using Gemini API
            </p>
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message) => (
              <Bubbles key={message.id} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
        <form onSubmit={handleSubmit}>
          <input
            className="question-box"
            type="text"
            onChange={handleInputChange}
            value={input}
            placeholder="Ask any F1 question"
            disabled={isLoading}
          />
          <input type="submit" />
        </form>
      </section>
    </main>
  );
};

export default Home;
