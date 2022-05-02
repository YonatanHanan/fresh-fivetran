declare module FreshChat {
  export interface Avatar {
    url: string;
  }

  export interface Property {
    name: string;
    value: string;
  }

  export interface User {
    email: string;
    avatar: Avatar;
    created_time: Date;
    id: string;
    phone: string;
    properties: Property[];
    first_name: string;
    last_name: string;
  }

  export interface Message {
    app_id: string;
    actor_type: string;
    actor_id: string;
    channel_id: string;
    message_type: string;
    message_parts: MessagePart[];
  }

  export interface User {
    id: string;
  }

  export interface Conversation {
    conversation_id: string;
    app_id: string;
    channel_id: string;
    messages: Message[];
    status: string;
    users: User[];
  }

  export interface Content {
    content: string;
  }

  export interface Image {
    url: string;
  }

  export interface UrlButton {
    url: string;
    label: string;
    target?: string;
  }

  export interface MessagePart {
    image?: Image;
    text?: Content;
    url_button?: UrlButton;
  }

  export interface ReplyPart {
    text: Content;
    collection?: {
      sub_parts: any[];
    };
  }

  export interface Message {
    message_parts: MessagePart[];
    reply_parts: ReplyPart[];
    app_id: string;
    actor_id: string;
    id: string;
    channel_id: string;
    conversation_id: string;
    message_type: string;
    actor_type: string;
    created_time: Date;
  }

  export interface Messages {
    messages: Message[];
  }

  export interface Agent {
    biography: string;
    groups: any[];
    status: number;
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: Avatar;
    social_profiles: SocialProfile[];
  }

  export interface Avatar {
    url: string;
  }

  export interface SocialProfile {
    type: string;
    id: string;
  }

  export interface Channel {
    id: string;
    icon: Icon;
    updated_time: string;
    enabled: boolean;
    public: boolean;
    name: string;
    tags: string[];
    welcome_message: WelcomeMessage;
  }

  export interface Icon {}

  export interface WelcomeMessage {
    message_parts: MessagePart[];
    message_type: string;
  }

  export interface Group {
    id: string;
    name: string;
    description: string;
    routing_type: string;
    agents: Agent[];
  }
}

export const ReportTypes = [
  'Conversation-Created',
  'Message-Sent',
  'Conversation-Resolved',
  'CSAT-Score',
  'Conversation-Resolution-Label',
  'Agent-Activity',
  'Response-Time',
  'Resolution-Time',
];
