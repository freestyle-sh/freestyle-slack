import { cloudstate, useLocal } from "freestyle-sh";
import {
  PasskeyAuthentication,
  type FinishPasskeyRegistrationJSON,
} from "freestyle-auth/passkey";

@cloudstate
export class AuthCS extends PasskeyAuthentication {
  static readonly id = "auth";

  users = new Map<string, UserCS>();

  get rpid() {
    return import.meta.env.DEV ? "localhost" : import.meta.env.FREESTYLE_DOMAIN;
  }

  override async finishRegistration(passkey: FinishPasskeyRegistrationJSON) {
    const info = await super.finishRegistration(passkey);
    const blob = await fetch(
      `https://api.dicebear.com/8.x/bottts/svg?seed=${Math.random()}`
    ).then((res) => res.blob());
    const user = new UserCS(info.id, info.username, new ImageCS(blob));
    user.displayName = info.username.split("@")[0];

    this.users.set(user.id, user);
    return {
      id: user.id,
      username: user.username,
    };
  }

  override getCurrentUser() {
    const info = super.getCurrentUser();
    if (!info) return;
    return Array.from(this.users.values()).find((user) => user.id === info.id);
  }

  override getDefiniteCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  getUserInfo() {
    return this.getCurrentUser()?.getPersonalInfo();
  }
}

@cloudstate
export class UserCS {
  constructor(
    public id: string,
    public username: string,
    public image: ImageCS,
    public displayName?: string
  ) {}

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  updateProfile(profile: { displayName?: string; image?: Blob }) {
    const user = useLocal(AuthCS).getDefiniteCurrentUser();
    if (user.id !== this.id) {
      throw new Error("You are not authorized to change other users' profile");
    }

    if (profile.image) {
      this.image = new ImageCS(profile.image);
    }

    if (profile.displayName) {
      this.displayName = profile.displayName;
    }

    return {
      displayName: this.displayName,
      image: this.image.getUrlPath(),
    };
  }

  getPersonalInfo() {
    return {
      username: this.username,
      id: this.id,
      image: this.image.getUrlPath(),
      displayName: this.displayName,
    };
  }

  getPublicInfo() {
    return {
      displayName: this.displayName,
      image: this.image.getUrlPath(),
    };
  }
}

@cloudstate
export class ImageCS {
  id = crypto.randomUUID();
  blob: Blob;

  constructor(blob: Blob) {
    this.blob = blob;
  }

  async fetch(_request: Request) {
    return new Response(await this.blob.arrayBuffer(), {
      headers: {
        "Content-Type": this.blob.type,
        "Content-Length": this.blob.size.toString(),
      },
    });
  }

  getUrlPath() {
    return `/cloudstate/instances/${this.id}`;
  }
}
