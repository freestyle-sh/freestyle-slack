import { MessageListCS } from "freestyle-chat";
import { Chat as FreestyleChat } from "freestyle-chat/react";
import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import type { ConversationCS } from "../cloudstate/chat-manager";
import { useEffect } from "react";

export function Chat(props: { chatRoomId: string }) {
  const messageList = useCloud<typeof ConversationCS>(props.chatRoomId);

//   const {data: messages} = useCloudQuery(messageList.getMessages);
//   console.log(messages);

  useEffect(() => {
    async function testing(){
        try {
        const messages = await messageList.getMessages()
        console.log("Use effect", messages)
        } catch (error) {
            console.log(error)
        }
    }
    testing()
    
  }, [])

  return (
    <div>
      <FreestyleChat messageList={messageList} />
    </div>
  );
}
