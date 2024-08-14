import { useState } from "react";
import { useCloud } from "freestyle-sh";
import type { ConversationManagerCS } from "../cloudstate/chat-manager";

export function NewChannel() {
  const [channelName, setChannelName] = useState("");
  const channelManager = useCloud<typeof ConversationManagerCS>("channels");

  // const {mutate} = useCloudMutation(channelManager.createChannel);

  return (
    <div className="fixed flex items-center justify-center bg-gray-900/40 h-screen w-screen">
      <form
        className=" bg-white p-4 rounded-lg min-w-[60vw] max-w-[90vw] sm:max-w-[60vw] flex-col flex"
        onSubmit={(e) => {
          e.preventDefault();
          // mutate(channelName)
          if (channelName !== "") {
            const newName = channelName.toLowerCase().replace(/ /g, "-");
            channelManager.createChannel(newName).then((channel) => {
              window.location.href = `/channels/${channel.id}`;
            });
          }
        }}
      >
        <div className="flex flex-row justify-between">
          <h1 className="text-xl font-bold">Create a Channel</h1>
          <button
            className="stroke-gray-600"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <XMark />
          </button>
        </div>
        <br className="my-2" />
        <label className=" font-bold text-lg">Name</label>
        <div className="relative w-full">
          <input
            pattern="^[a-z-]+$"
            className="w-full my-2 pl-7 rounded-lg border-2 border-gray-300 focus:border-sky-500 p-2  focus:outline-sky-400/25 transition-all focus:outline focus:outline-4"
            // type="text"
            placeholder="Channel Name"
            onChange={(e) => {
              // check regex
              setChannelName(e.target.value);

              // setChannelName(e.target.value)
            }}
          />
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-lg">
            #
          </div>
        </div>
        <p className="text-gray-600 ">
          People send messages in channels. Some of these messages are nice,
          some are not. Please be nice.
        </p>

        <div className="flex flex-row justify-end mt-2">
          <button
            type="submit"
            className={
              "p-2 rounded-lg transition-all px-4 " +
              (channelName !== ""
                ? "bg-[#1d7953] hover:bg-[#196948] text-white hover:shadow-md"
                : "bg-gray-300 text-gray-700")
            }
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export function XMark() {
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
