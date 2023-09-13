"use client";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Message, useChat } from "ai/react";
import { ReactElement, useRef, useState } from "react";

import { ButtonType, ChatButton } from "@/components/ChatButton";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import React from "react";

export function ChatWindow(props: {
  emptyStateComponent: ReactElement;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isChatResetting, setIsChatResetting] = useState(false);
  const [isAugmented, setIsAugmented] = useState(false);

  const {
    emptyStateComponent,
    placeholder,
    titleText = "An LLM",
    emoji,
  } = props;

  const ingestForm = !isAugmented && (
    <UploadDocumentsForm setAugmented={() => setIsAugmented(true)} />
  );

  const { messages, input, setInput, handleInputChange, setMessages } =
    useChat();

  async function sendMessage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (input.trim() === "" || isAiResponding || isChatResetting) {
      return;
    }

    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setInput("");
    const newMessage: Message = {
      id: messages.length.toString(),
      content: input,
      role: "user",
    };
    const messagesWithUserReply = [...messages, newMessage];
    setMessages(messagesWithUserReply);

    setIsAiResponding(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/llm/chat`,
        {
          message: newMessage,
        }
      );
      const json = response.data;
      if (response.status >= 200 && response.status < 300) {
        setMessages([
          ...messagesWithUserReply,
          {
            id: messagesWithUserReply.length.toString(),
            content: json.output,
            role: "assistant",
          },
        ]);
      }
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        throw new Error(error.response.data.error);
      }
    } finally {
      setIsAiResponding(false);
    }
  }

  async function resetChat(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (isAiResponding || isChatResetting) {
      return;
    }

    setIsChatResetting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/llm/reset-chat`
      );
      if (response.status >= 200 && response.status < 300) {
        setMessages([]);
      }
    } catch (error: any) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
        throw new Error(error.response.data.error);
      }
    } finally {
      setIsChatResetting(false);
    }
  }

  return (
    <div
      className={`flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden ${
        messages.length > 0 ? "border" : ""
      }`}
    >
      <h2 className={`${messages.length > 0 ? "" : "hidden"} text-2xl`}>
        {emoji} {titleText}
      </h2>
      {messages.length === 0 ? emptyStateComponent : ""}
      <div
        className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages]
              .reverse()
              .map((m) => (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  aiEmoji={emoji}
                ></ChatMessageBubble>
              ))
          : ""}
      </div>

      {messages.length === 0 && ingestForm}

      {isAugmented && (
        <div className="flex w-full mt-4">
          <input
            className="grow mr-8 p-4 rounded"
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(
                  new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                  }) as unknown as React.MouseEvent<
                    HTMLButtonElement,
                    MouseEvent
                  >
                );
              }
            }}
          />

          <ChatButton
            isLoading={isAiResponding}
            onClick={sendMessage}
            type={ButtonType.PRIMARY}
          >
            Send
          </ChatButton>
          <div className="ml-8">
            <ChatButton
              isLoading={isChatResetting}
              onClick={resetChat}
              type={ButtonType.CRITICAL}
            >
              Reset
            </ChatButton>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
