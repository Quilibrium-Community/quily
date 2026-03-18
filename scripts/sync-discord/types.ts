// scripts/sync-discord/types.ts

/** A Discord message from the REST API (fields we care about) */
export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    global_name: string | null;
  };
  timestamp: string; // ISO 8601
  embeds: DiscordEmbed[];
  attachments: DiscordAttachment[];
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
}

export interface DiscordAttachment {
  filename: string;
  url: string;
  content_type?: string;
}

/** Discord channel info from the REST API */
export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  guild_id: string;
}

/** Parsed channel config from DISCORD_CHANNEL_IDS env var */
export interface ChannelConfig {
  id: string;
  name: string;
  guildId?: string;
}

/** Manifest tracking scrape state per channel */
export interface DiscordManifest {
  version: number;
  lastRun: string;
  channels: Record<string, ChannelManifestEntry>;
}

export interface ChannelManifestEntry {
  /** Last message ID fetched (Discord snowflake) */
  lastMessageId: string | null;
  /** Channel name (for display) */
  name: string;
  /** Last successful scrape timestamp */
  lastScraped: string;
}
