import prisma_next from "@lib/db";
import { PermissionAction } from "@prisma/client";

const permissions: PermissionAction[] = [
  PermissionAction.ACCESS_ADMIN_DASHBOARD,
  PermissionAction.MANAGE_TENANTS,
  PermissionAction.MANAGE_ROLES,
  PermissionAction.MANAGE_PERMISSIONS,
  PermissionAction.VIEW_AUDIT_LOGS,
  PermissionAction.MANAGE_BILLING,
  PermissionAction.VIEW_ALL_DATA,
  PermissionAction.MANAGE_SUBSCRIPTIONS,
  PermissionAction.MANAGE_STAFF,
  PermissionAction.VIEW_STAFF,
  PermissionAction.ASSIGN_ROLES,
  PermissionAction.VIEW_PATIENT_RECORDS,
  PermissionAction.EDIT_PATIENT_RECORDS,
  PermissionAction.CREATE_PATIENT_RECORDS,
  PermissionAction.DELETE_PATIENT_RECORDS,
  PermissionAction.VIEW_PATIENT_HISTORY,
  PermissionAction.MANAGE_PATIENT_CONSENTS,
  PermissionAction.SCHEDULE_APPOINTMENTS,
  PermissionAction.VIEW_APPOINTMENTS,
  PermissionAction.EDIT_APPOINTMENTS,
  PermissionAction.CANCEL_APPOINTMENTS,
  PermissionAction.VIEW_APPOINTMENT_HISTORY,
  PermissionAction.CREATE_TREATMENT_PLANS,
  PermissionAction.VIEW_TREATMENT_PLANS,
  PermissionAction.EDIT_TREATMENT_PLANS,
  PermissionAction.DELETE_TREATMENT_PLANS,
  PermissionAction.PRESCRIBE_MEDICATION,
  PermissionAction.ADMINISTER_TREATMENTS,
  PermissionAction.SEND_MESSAGES,
  PermissionAction.VIEW_MESSAGES,
  PermissionAction.MANAGE_NOTIFICATIONS,
  PermissionAction.VIEW_INVENTORY,
  PermissionAction.MANAGE_INVENTORY,
  PermissionAction.ORDER_SUPPLIES,
  PermissionAction.VIEW_SUPPLY_ORDERS,
  PermissionAction.VIEW_FINANCIAL_RECORDS,
  PermissionAction.MANAGE_EXPENSES,
  PermissionAction.VIEW_INSURANCE_CLAIMS,
  PermissionAction.MANAGE_INSURANCE_CLAIMS,
  PermissionAction.VIEW_REPORTS,
  PermissionAction.GENERATE_REPORTS,
  PermissionAction.EXPORT_DATA,
  PermissionAction.MANAGE_USER_ACCOUNTS,
  PermissionAction.RESET_USER_PASSWORDS,
  PermissionAction.DEACTIVATE_USER_ACCOUNTS,
  PermissionAction.VIEW_SALES,
  PermissionAction.CREATE_SALES,
  PermissionAction.EDIT_SALES,
  PermissionAction.DELETE_SALES,
  PermissionAction.VIEW_MEDICATIONS,
  PermissionAction.CREATE_MEDICATIONS,
  PermissionAction.EDIT_MEDICATIONS,
  PermissionAction.DELETE_MEDICATIONS,
  PermissionAction.VIEW_INVENTORY_CHANGES,
  PermissionAction.MANAGE_INVENTORY_CHANGES,
];
export async function createPermissions() {
  try {
    // Check if permissions already exist
    const existingPermissions = await prisma_next.permission.findMany({
      where: {
        action: { in: permissions },
      },
    });

    // If all permissions exist, return early
    if (existingPermissions.length === permissions.length) {
      return { success: true, msg: "All permissions already exist" };
    }

    // Calculate missing permissions
    const existingActions = new Set(existingPermissions.map((p) => p.action));
    const missingPermissions = permissions.filter(
      (action) => !existingActions.has(action)
    );

    // Use transaction to ensure all or nothing execution
    await prisma_next.$transaction(async (tx) => {
      for (const action of missingPermissions) {
        await tx.permission.upsert({
          where: { action },
          update: {},
          create: { action },
        });
      }
    });

    return { success: true, msg: "Permissions created successfully" };
  } catch (error) {
    console.error("Failed to create permissions:", error);
    return { success: false, msg: "Failed to create permissions" };
  }
}
