import { handlePasskeyRegistration } from "freestyle-auth/passkey";
import type { AuthCS } from "../cloudstate/auth";
import { useCloud } from "freestyle-sh";
import { useState } from "react";

export function SignIn() {
  const auth = useCloud<typeof AuthCS>("auth");
  const [username, setUsername] = useState("");

  return (
    <div className="grid max-w-lg mx-auto gap-2 mt-8">
      <h1 className="text-2xl font-bold text-center mb-2">Sign In</h1>
      <input
        type="email"
        placeholder="example@example.com"
        onChange={(e) => setUsername(e.currentTarget.value)}
        className="border py-1 px-2 rounded-md"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 font-medium text-white py-1 px-2 rounded"
        onClick={async () => {
          // get passkey generation options
          const options = await auth.startRegistration(username);

          // create a passkey in the browser
          const passkey = await handlePasskeyRegistration(options);

          // register the passkey with the server
          await auth.finishRegistration(passkey);
          // go back to the homepage
          window.location.href = "/";
        }}
      >
        Login with Passkey
      </button>
    </div>
  );
}
