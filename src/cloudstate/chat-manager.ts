import { cloudstate, invalidate, useCloud, useLocal } from "freestyle-sh";
import { MessageListCS, TextMessageCS } from "freestyle-chat";
import type { BaseUserCS } from "freestyle-auth/passkey";
import { AuthCS } from "./auth";

export interface PublicChannelData {
  id: string;
  name: string;
}
@cloudstate
export class ConversationManagerCS {
  static readonly id = "channels";
  channels = new Map<string, ConversationCS>();
  dms = new Map<string, ConversationCS>();

  constructor() {
    const newConversations = [
      new ConversationCS("General"),
      new ConversationCS("Random"),
      new ConversationCS("Help"),
      new ConversationCS("Development"),
      new ConversationCS("Design"),
      new ConversationCS("Marketing"),
      new ConversationCS("Sales"),
      new ConversationCS("Management"),
    ];
    newConversations.forEach((c) => this.channels.set(c.id, c));
  }

  createChannel(name: string) {
    const channel = new ConversationCS(name);
    this.channels.set(channel.id, channel);
    invalidate(
      useCloud<typeof ConversationManagerCS>(ConversationManagerCS.id)
        .listChannels
    );
    return channel;
  }

  listChannels(): PublicChannelData[] {
    return Array.from(this.channels.values()).map((c) => c.publicInfo());
  }

  deleteChannel(channel: ConversationCS) {
    invalidate(
      useCloud<typeof ConversationManagerCS>(ConversationManagerCS.id)
        .listChannels
    );
    this.channels.delete(channel.id);
  }
}

@cloudstate
export class ConversationCS extends MessageListCS<[SlackMessage]> {
  id = crypto.randomUUID();

  name: string;
  description = "";

  override async sendTextMessage(message: {
    text: string;
  }): Promise<SlackMessage> {
    return await super._addMessage(
      new SlackMessage({
        text: message.text,
        sender: this.getCurrentUser(),
      })
    );
  }

  constructor(name: string) {
    super();
    this.name = name;
  }

  publicInfo(): PublicChannelData {
    return {
      id: this.id,
      name: this.name,
    };
  }

  getMessages() {
    return super.getMessages().map((message) => ({
      ...message,
      sender: {
        ...message.sender,
        image: useLocal(AuthCS)
          .users.get(message.sender.id)
          ?.image.getUrlPath(),
      },
    }));
  }

  _onMessageAdded(message: TextMessageCS): void {}

  getCurrentUser(): BaseUserCS {
    return useLocal(AuthCS).getDefiniteCurrentUser();
  }
}

// @cloudstate
// export class OurTextMessageCS extends TextMessageCS {
//   getData(): { type: "TEXT_MESSAGE"; text: string; } {
//     return {
//       type: "TEXT_MESSAGE",
//       text: this.data.text,
//     }
//   }
// }
@cloudstate
export class SlackMessage extends TextMessageCS {
  reactions: Map<
    string,
    {
      [userId: string]: undefined;
    }
  > = new Map();

  constructor(props: {
    text: string;
    sender: {
      id: string;
      username: string;
    };
  }) {
    super({
      text: props.text,
      sender: {
        id: props.sender.id,
        username: props.sender.username,
      },
    });
  }

  getReactions() {
    return Array.from(this.reactions.entries()).map(([reaction, users]) => ({
      reaction,
      users: Object.keys(users),
    }));
  }

  addReaction(reaction: string) {
    const userId = useLocal(AuthCS).getDefiniteCurrentUser().id;
    const reactions = this.reactions.get(reaction);
    if (reactions) {
      reactions[userId] = undefined;
    } else {
      this.reactions.set(reaction, { [userId]: undefined });
    }

    invalidate(useCloud<typeof SlackMessage>(this.id).getReactions);
  }

  removeReaction(reaction: string, userId: string) {
    const reactions = this.reactions.get(reaction);
    if (reactions) {
      delete reactions[userId];
    }
    invalidate(useCloud<typeof SlackMessage>(this.id).getReactions);
  }
}
