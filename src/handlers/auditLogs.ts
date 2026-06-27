import { AuditLogEvent, Client, GuildAuditLogsActionType, GuildAuditLogsEntry, GuildAuditLogsTargetType } from "discord.js";
import { getGuild, objectContainsGuildId } from "../util/guildUtil";
import { onSoundCreate as onSoundboardSoundCreate } from "./soundboard";

export interface AuditLogEventHandlerProps {
  /**
   * The discord client/bot instance.
   */
  client: Client<boolean>;
  /**
   * The audit log entry that was created.
   */
  auditLog: GuildAuditLogsEntry<AuditLogEvent, GuildAuditLogsActionType, GuildAuditLogsTargetType>;
}

/**
 * Handles the event when a new audit log entry is created.
 * @param auditLogProps - The properties needed to handle the audit log event creation.
 */
export const onAuditLogEntryCreate = (auditLogProps: AuditLogEventHandlerProps) => {
  const { auditLog } = auditLogProps;

  if (auditLog.action === AuditLogEvent.SoundboardSoundCreate) {
    onSoundboardSoundAuditLogEntryCreate(auditLogProps);
  }

  // Add more audit log events here if needed
};

/**
 * Handles the event when a new soundboard sound is created.
 * @param auditLogProps - The properties needed to handle the audit log event creation.
 * @returns 
 */
export const onSoundboardSoundAuditLogEntryCreate = (auditLogProps: AuditLogEventHandlerProps) => {
  const { client, auditLog } = auditLogProps;

  const soundName = auditLog.changes.find((change: { key: string; new?: unknown }) => change.key === "name")?.new;
  const soundId = auditLog.changes.find((change: { key: string; new?: unknown }) => change.key === "sound_id")?.new;

  if (!soundId || !soundName) {
    console.log("sound_id or sound_name not found while creating soundboard sound notification.");
    return;
  }

  if (!objectContainsGuildId(auditLog.target)) {
    console.log(`guild_id not found while creating soundboard sound notification for ${soundName}`);
    return;
  }

  const guild = getGuild(client, auditLog.target.guild_id);
  guild
  if (!guild) {
    return;
  }

  onSoundboardSoundCreate(soundName, soundId, guild);
};