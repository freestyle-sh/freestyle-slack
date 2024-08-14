import type { PublicChannelData } from "../cloudstate/chat-manager";
import { Chat } from "./Chat";
import { SideBar } from "./Sidebar";

export function SlackLayout(props: {
  chatRoomId: string;
  baseChannels: PublicChannelData[];
}) {
  return (
    <div className="grid grid-cols-[20rem_1fr] h-screen">
      <SideBar
        baseChannels={props.baseChannels}
        chatRoomId={props.chatRoomId}
      />
      <Chat chatRoomId={props.chatRoomId} />
    </div>
  );
}
