

export function ChannelLink(props: {
    channel: {
        id: string;
        name: string;
    }
    isSelected?: boolean;
}){
   return <a data-channel-id={props.channel.id} className={"p-1 px-2 my-[2px] transition-all rounded-lg " + (props.isSelected? "bg-white text-[#5A2B5D]":"text-gray-200 hover:bg-gray-200/20 ")} href={
         `/channels/${props.channel.id}`
   }># {props.channel.name}</a>
}