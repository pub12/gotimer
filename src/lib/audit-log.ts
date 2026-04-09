import Database from "better-sqlite3";

export function logAdminAction(
  db: Database.Database,
  admin_user_id: string,
  action: string,
  target_type: string,
  target_id: string | null,
  old_value: string | null,
  new_value: string | null
): void {
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO admin_audit_log (id, admin_user_id, action, target_type, target_id, old_value, new_value)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, admin_user_id, action, target_type, target_id, old_value, new_value);
}
