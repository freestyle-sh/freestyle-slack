import { MessageListCS } from "freestyle-chat";
import { Chat as FreestyleChat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { ConversationCS } from "../cloudstate/chat-manager";
import { useEffect, useState } from "react";

export function Chat(props: { chatRoomId: string }) {
  const messageList = useCloud<typeof ConversationCS>(props.chatRoomId);

  const { data: messages } = useCloudQuery(messageList.getMessages);

  const [newMessage, setNewMessage] = useState("");
  // console.log(messages);
  console.log("Chat", messages);

  return (
    <FreestyleChat
      messageList={messageList}
      messageInput={
        <form
          className=" absolute bottom-2 left-2 right-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await messageList.sendTextMessage({ text: newMessage });
            setNewMessage("");
          }}
        >
          <div className="relative w-full">
            <input
              value={newMessage}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-sky-400/25 transition-all focus:outline focus:outline-4 "
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
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
      displayMessage={(message) => (
        <div className="flex flex-row text-base hover:bg-gray-100 p-2 rounded-lg">
          <div className="bg-gray-300 h-12 rounded-lg aspect-square mr-2 my-2"></div>
          <div>
            <div className=" font-bold ">{message.sender.displayName}</div>
            <div>{message.data.text}</div>
          </div>
        </div>
      )}
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
