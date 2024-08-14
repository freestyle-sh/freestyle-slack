import {
  ConversationManagerCS,
  type PublicChannelData,
} from "../cloudstate/chat-manager";
import { useCloud } from "freestyle-sh";
import { Chat } from "./Chat";
import { SideBar } from "./Sidebar";

export function SlackLayout(props: {
  chatRoomId: string;
  baseChannels: PublicChannelData[];
}) {
  return (
    <div className="grid grid-cols-[20rem_1fr] h-screen overflow-hidden">
      <SideBar
        baseChannels={props.baseChannels}
        chatRoomId={props.chatRoomId}
      />
      <div className="h-screen">
        <Chat chatRoomId={props.chatRoomId} />
      </div>
    </div>
  );
}
