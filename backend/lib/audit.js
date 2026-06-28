import { supabase } from './supabase.js';
import { logError } from './logger.js';

export const recordAuditEvent = async ({
  actorId,
  action,
  entityType,
  entityId,
  details = {},
}) => {
  const payload = {
    actor_id: actorId || null,
    action,
    entity_type: entityType,
    entity_id: entityId || null,
    details,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('admin_audit_logs').insert(payload);
  if (error) {
    logError('admin.audit.insert_failed', error, { action, entityType, entityId });
  }
};
