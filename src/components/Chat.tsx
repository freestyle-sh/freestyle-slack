import { Chat as FreestyleChat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { ConversationCS } from "../cloudstate/chat-manager";

export function Chat(props: { chatRoomId: string }) {
  const messageList = useCloud<typeof ConversationCS>(props.chatRoomId);

  const { data: messages } = useCloudQuery(messageList.getMessages);
  // console.log(messages);
  console.log("Chat", messages);

  return (
    <div>
      <FreestyleChat
        messageList={messageList}
        displayMessage={(message) => (
          <div>
            <div>{message.sender.displayName}</div>
            <div>{message.data.text}</div>
          </div>
        )}
      />
    </div>
  );
}
