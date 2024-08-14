import { useCloudQuery } from "freestyle-sh/react";
import type { SlackMessage } from "../cloudstate/chat-manager";
import { useCloud } from "freestyle-sh";

export function TextMessage(props: {
  message: {
    data: any;
    sender: {
      id: string;
      displayName: string;
      image: string;
    };
    id: string;
    isSelf: boolean;
  };
}) {
  const msg = useCloud<typeof SlackMessage>(props.message.id);
  const reactions = useCloudQuery(msg.getReactions);
  return (
    <div className="flex flex-row hover:bg-gray-50 py-2 px-4 text-sm -mx-2">
      <img
        src={props.message.sender.image}
        className="rounded w-10 h-10 block mr-2 border"
      />
      <div>
        <div className="font-bold">{props.message.sender.displayName}</div>
        <div>{props.message.data.text}</div>
        <div className="flex flex-row space-x-2">
          {/* <button
            className="
           bg-gray-100 py-[2px]  px-2 hover:bg-gray-200 rounded-lg transition-all"
            onClick={async () => {
              await msg.addReaction("❤️");
            }}
          >
            ❤️
          </button>
          {reactions.data?.map((reaction) => (
            <>
              <button
                key={reaction.reaction}
                className="
             bg-gray-100 py-[2px]  px-2 hover:bg-gray-200 rounded-lg transition-all"
              >
                {reaction.reaction} | {reaction.users.length}
              </button>
            </>
          ))} */}
        </div>
      </div>
    </div>
  );
}
