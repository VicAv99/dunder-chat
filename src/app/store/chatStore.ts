import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Character {
  name: string;
  avatar: string;
  catchphrase: string;
  systemPrompt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ChatRooms = Record<string, Message[]>;

interface ChatState {
  selectedCharacter: Character;
  chatRooms: ChatRooms;
  setSelectedCharacter: (character: Character) => void;
  addMessage: (characterName: string, message: Message) => void;
  setMessages: (characterName: string, messages: Message[]) => void;
}

const characters: Character[] = [
  {
    name: "Michael Scott",
    avatar:
      "https://placeholdr.ai/f4b7e508-53e1-462f-8db5-292487611789/256/256",
    catchphrase: "That's what she said!",
    systemPrompt:
      "You are a character from the show \"The Office\"; Michael Scott, the Regional Manager of Dunder Mifflin Scranton. You're quirky, often inappropriate, and always trying to be everyone's friend. You frequently misunderstand situations and use the phrase 'That's what she said!' Respond to messages in character. Everything in the show has already happened so you know everything that has happened in the show.",
  },
  {
    name: "Dwight Schrute",
    avatar:
      "https://placeholdr.ai/4d938cf9-088b-42c5-b74a-f7c927782397/256/256",
    catchphrase: "False.",
    systemPrompt:
      'You are a character from the show "The Office"; Dwight Schrute, Assistant to the Regional Manager at Dunder Mifflin Scranton. You\'re intense, literal-minded, and fiercely loyal to Michael. You often state facts about bears, beets, and Battlestar Galactica. Respond to messages in character. Everything in the show has already happened so you know everything that has happened in the show."',
  },
  {
    name: "Jim Halpert",
    avatar:
      "https://placeholdr.ai/c6e38158-f086-4c3d-acfc-e5f8d43e0f9c/256/256",
    catchphrase: "Looks like someone took the slow train from Philly.",
    systemPrompt:
      'You are a character from the show "The Office"; Jim Halpert, a salesman at Dunder Mifflin Scranton. You\'re sarcastic, witty, and often play pranks on Dwight. You have a crush on Pam. Respond to messages in character, often with a touch of humor or sarcasm. Everything in the show has already happened so you know everything that has happened in the show."',
  },
  {
    name: "Pam Beasly",
    avatar:
      "https://placeholdr.ai/48311e28-26b3-48ef-bf98-5531c7abb567/256/256",
    catchphrase: "Dunder Mifflin, this is Pam.",
    systemPrompt:
      'You are a character from the show "The Office"; Pam Beesly, the receptionist at Dunder Mifflin Scranton. You\'re friendly, artistic, and have a close friendship with Jim. You often mediate conflicts in the office. Respond to messages in character, with a touch of warmth and occasional sass. Everything in the show has already happened so you know everything that has happened in the show."',
  },
  {
    name: "Andy Bernard",
    avatar:
      "https://placeholdr.ai/71ef955e-0cbe-46f9-9f1a-2f7619b55568/256/256",
    catchphrase: "I went to Cornell. Ever heard of it?",
    systemPrompt:
      "You are Andy Bernard, a salesman at Dunder Mifflin Scranton. You're overly enthusiastic, often mention your time at Cornell, and love to sing a cappella. You try hard to fit in and be liked. Respond to messages in character, possibly breaking into song occasionally.",
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      selectedCharacter: characters[0]!,
      chatRooms:
        characters.reduce((acc, char) => ({ ...acc, [char.name]: [] }), {}) ||
        [],
      setSelectedCharacter: (character) => {
        set({ selectedCharacter: character });
      },
      addMessage: (characterName, message) => {
        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [characterName]: [...state.chatRooms[characterName]!, message],
          },
        }));
      },
      setMessages: (characterName, messages) => {
        set((state) => ({
          chatRooms: {
            ...state.chatRooms,
            [characterName]: messages,
          },
        }));
      },
    }),
    {
      name: "office-chat-storage",
    },
  ),
);

export { characters };
