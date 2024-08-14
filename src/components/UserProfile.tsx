import { useCloud } from "freestyle-sh";
import { AuthCS } from "../cloudstate/auth";
import { useCloudQuery } from "freestyle-sh/react";

export function UserProfile() {
  const auth = useCloud<typeof AuthCS>("auth");
  const { data: user } = useCloudQuery(auth.getUserInfo);

  return (
    <div>
      <img src={user?.image} className="rounded w-10 h-10 block" />
    </div>
  );
}
