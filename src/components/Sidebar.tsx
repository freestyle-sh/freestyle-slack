import { useCloudQuery } from "freestyle-sh/react";
import {
  ConversationManagerCS,
  type PublicChannelData,
} from "../cloudstate/chat-manager";
import { useCloud } from "freestyle-sh";
import { ChannelLink } from "./ChannelLink";
import { UserProfile } from "./UserProfile";

export function SideBar(props: {
  baseChannels: PublicChannelData[];
  chatRoomId?: string | undefined;
}) {
  const channelsManager = useCloud<typeof ConversationManagerCS>("channels");
  const { data: channels } = useCloudQuery(channelsManager.listChannels);

  return (
    <div className="grid grid-cols-[4rem_auto] bg-[#5A2B5D]">
      <div className="justify-end flex flex-col h-screen border-r border-white/25">
        <div className="p-2">
          <UserProfile />
        </div>
      </div>
      <div className="flex flex-col p-4 text-white  h-screen">
        <div className="flex justify-between">
          <div>Channels</div>
          <a href="/new-channel" className="">
            +
          </a>
        </div>
        {(channels ?? props.baseChannels).map((channel) => (
          <ChannelLink
            channel={channel}
            isSelected={
              props.chatRoomId === channel.id && props.chatRoomId !== undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
