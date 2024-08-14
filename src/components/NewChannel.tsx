import {useState} from "react";
import {useCloud} from "freestyle-sh";
import {useCloudMutation} from "freestyle-sh/react";
import {ConversationManagerCS} from "../cloudstate/chat-manager";

export function NewChannel() {
    const [channelName, setChannelName] = useState("");
    const channelManager = useCloud<typeof ConversationManagerCS>("channels");

    // const {mutate} = useCloudMutation(channelManager.createChannel);

    return (
        <div>
            <h1>New Channel</h1>

            <input type="text" placeholder="Channel Name" onChange={(e) => setChannelName(e.target.value)}/>

            <button onClick={() => {
                channelManager.createChannel(channelName).then(channel => {
                    window.location.href = `/channels/${channel.id}`
                })
            }}>Create</button>
        </div>
    )
}