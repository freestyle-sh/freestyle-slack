import { handlePasskeyRegistration } from "freestyle-auth/passkey";
import type { AuthCS } from "../cloudstate/auth";
import { useCloud } from "freestyle-sh";
import { useState } from "react";

export function SignIn() {
  const auth = useCloud<typeof AuthCS>("auth");
  const [username, setUsername] = useState("");

  return (
    <div className="flex h-screen items-center justify-center bg-[#5A2B5D]">
      <form
        className="grid max-w-lg mx-auto gap-2 bg-white p-6 rounded-lg shadow-sm min-w-[50vw]"
        onSubmit={async (e) => {
          e.preventDefault();
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
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <p className="text-gray-600 text-center  mb-4">
          Enter the name you want to use in the chat.
        </p>
        <input
          type="name"
          placeholder="Beyonce"
          onChange={(e) => setUsername(e.currentTarget.value)}
          className="border py-1 px-2 rounded-md mb-2"
        />
        <button
          className="bg-[#5A2B5D] hover:bg-[#743878] font-medium text-white py-1 px-2 rounded transition-all"
          type="submit"
        >
          Login with Passkey
        </button>
      </form>
    </div>
  );
}
