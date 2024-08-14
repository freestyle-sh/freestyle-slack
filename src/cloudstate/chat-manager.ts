import { cloudstate, invalidate, useCloud, useRequest } from "freestyle-sh";
import { MessageListCS, TextMessageCS } from "freestyle-chat";
import { parse as parseCookie} from 'cookie';

export interface PublicChannelData {
  id: string;
  name: string;
}
@cloudstate
export class ConversationManagerCS {
  static readonly id = "channels";
  channels = new Map<string, ConversationCS>();
  dms = new Map<string, ConversationCS>();

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
export class ConversationCS extends MessageListCS {
  id = crypto.randomUUID();

  name: string;

  constructor(name: string) {
    super();
    this.name = name;

  }

  publicInfo(): PublicChannelData{
    return {
      id: this.id,
      name: this.name,
    };
  }

  _onMessageAdded(message: TextMessageCS): void {
    
  }
}
