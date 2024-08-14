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
  return (
    <div className="flex flex-row hover:bg-gray-50 py-2 px-4 text-sm -mx-2">
      <img
        src={props.message.sender.image}
        className="rounded w-10 h-10 block mr-2 border"
      />
      <div>
        <div className="font-bold">{props.message.sender.displayName}</div>
        <div>{props.message.data.text}</div>
      </div>
    </div>
  );
}
