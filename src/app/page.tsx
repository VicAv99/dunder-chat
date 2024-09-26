"use client";

import { useChat } from 'ai/react';
import React, { useEffect, useRef } from 'react';
import { characters, useChatStore } from '~/app/store/chatStore';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

export const dynamic = 'force-dynamic'

export default function TheOfficeChatGPT() {
  const {
    selectedCharacter,
    chatRooms,
    setSelectedCharacter,
    addMessage,
    setMessages,
  } = useChatStore();
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages: setChatMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: chatRooms[selectedCharacter.name],
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      systemPrompt: selectedCharacter.systemPrompt,
    },
    onFinish: (message) => {
      addMessage(selectedCharacter.name, message);
    },
  });

  console.log("messages", messages);

  const handleCharacterChange = (value: string): void => {
    const newCharacter = characters.find((char) => char.name === value);
    if (newCharacter) {
      setSelectedCharacter(newCharacter);
      setChatMessages(chatRooms[newCharacter.name]);
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages(selectedCharacter.name, messages);
  }, [messages, selectedCharacter, setMessages]);

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col border-x border-gray-300 bg-[#F0F0F0] shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#1B365D] p-4 text-white">
        <h1 className="text-2xl font-bold">Dunder Mifflin AI</h1>
        <Select
          onValueChange={handleCharacterChange}
          value={selectedCharacter.name}
        >
          <SelectTrigger className="w-[180px] bg-white text-black">
            <SelectValue placeholder="Select a character" />
          </SelectTrigger>
          <SelectContent>
            {characters.map((char) => (
              <SelectItem key={char.name} value={char.name}>
                {char.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Character Info */}
      <div className="flex items-center bg-[#C4D8E2] p-2">
        <Avatar className="mr-2 h-10 w-10">
          <AvatarImage
            src={selectedCharacter.avatar}
            alt={selectedCharacter.name}
          />
          <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-semibold">{selectedCharacter.name}</span>
        {isLoading && (
          <span className="ml-2 text-sm text-gray-600">typing...</span>
        )}
      </div>

      {/* Chat Area */}
      <ScrollArea
        className="flex-grow bg-opacity-10 bg-[url('/placeholder.svg?height=600&width=800')] bg-repeat p-4"
        ref={chatAreaRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    message.role === "user"
                      ? "/placeholder.svg?height=40&width=40"
                      : selectedCharacter.avatar
                  }
                  alt={
                    message.role === "user" ? "User" : selectedCharacter.name
                  }
                />
                <AvatarFallback>
                  {message.role === "user" ? "U" : selectedCharacter.name[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={`mx-2 rounded-lg p-3 ${message.role === "user" ? "bg-[#C4D8E2] text-gray-800" : "bg-white text-gray-800"}`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-300 bg-[#F0F0F0] p-4"
      >
        <div className="flex space-x-2">
          <Input
            placeholder={`Chat with ${selectedCharacter.name}...`}
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-[#C4151C] text-white hover:bg-[#A11217]"
            disabled={isLoading}
          >
            Send
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="bg-[#1B365D] p-2 text-center text-sm text-white">
        Dunder Mifflin Paper Company, Inc. - Scranton Branch
      </div>
    </div>
  );
}
