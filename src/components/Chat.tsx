import { Chat as FreestyleChat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { ConversationCS, SlackMessage } from "../cloudstate/chat-manager";
import { useEffect, useState } from "react";
import { TextMessage } from "./TextMessage";

export function Chat(props: { chatRoomId: string }) {
  const messageList = useCloud<typeof ConversationCS>(props.chatRoomId);
  const [newMessage, setNewMessage] = useState("");

  return (
    <FreestyleChat<[SlackMessage], ConversationCS>
      messageList={messageList}
      messageInput={
        <form
          className="absolute bottom-2 left-2 right-2"
          onSubmit={async (e) => {
            if (newMessage === "") return;
            e.preventDefault();
            await messageList.sendTextMessage({
              text: newMessage,
            });
            setNewMessage("");
          }}
        >
          <div className="relative w-full px-2">
            <input
              value={newMessage}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-gray-400 outline-none"
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              placeholder={`Send a message`}
            />
            <button
              type="submit"
              className={
                "absolute right-1 top-1/2 -translate-y-1/2 focus:outline-none transition-all rounded-md p-1 px-2 " +
                (newMessage
                  ? "stroke-white bg-green-600 hover:bg-green-700"
                  : "stroke-gray-500")
              }
            >
              <SendIcon />
            </button>
          </div>
        </form>
      }
      displayMessage={(message) => <TextMessage message={message} />}
    />
  );
}

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}
