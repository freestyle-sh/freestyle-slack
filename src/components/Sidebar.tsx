import { useCloudQuery } from "freestyle-sh/react";
import type {
  ConversationManagerCS,
  PublicChannelData,
} from "../cloudstate/chat-manager";
import { useCloud } from "freestyle-sh";
import { ChannelLink } from "./ChannelLink";
import { UserProfile } from "./UserProfile";
import { useEffect, useState } from "react";

export function SideBar(props: {
  baseChannels: PublicChannelData[];
  chatRoomId?: string | undefined;
}) {
  const channelsManager = useCloud<typeof ConversationManagerCS>("channels");
  const { data: channels } = useCloudQuery(channelsManager.listChannels);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 1024 && !mounted) {
      setSidebarOpen(false);
    }
  });

  return (
    <div
      className="grid grid-cols-[4rem_auto] bg-[#5A2B5D] h-screen overflow-hidden shrink-0"
      style={{
        width: sidebarOpen ? "20rem" : "4rem",
      }}
    >
      <div className="justify-between items-center flex flex-col h-screen border-r border-white/25">
        <button
          className="py-2 px-2 my-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
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
            key={channel.id}
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
