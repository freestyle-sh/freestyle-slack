import { cloudstate } from "freestyle-sh";
import { PasskeyAuthentication } from "freestyle-auth/passkey";

@cloudstate
export class AuthCS extends PasskeyAuthentication {
    static readonly id = "auth";
    
    get rpid() {
        return import.meta.env.DEV ? "localhost" : import.meta.env.FREESTYLE_DOMAIN;
    }
}

