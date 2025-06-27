// --- Domain-Specific Data Types ---
export interface TenantResource {
  tenantId: string;
}

export type Patient = TenantResource & {
  id: string;
  name: string;
  isDischarged: boolean;
  assignedPhysicianId?: string;
};

export type Bed = TenantResource & {
  id:string;
  roomNumber: string;
  isOccupied: boolean;
  patientId: string | null;
};

export type TenantUser = TenantResource & {
  id: string;
  roles: Role[];
};

// ... a Tenant itself is not a TenantResource
export type Tenant = {
  id: string;
  name: string;
};

// --- Role Hierarchy for Your Application ---
// super_admin: Manages the entire system and tenants
// tenant_admin: Manages users, beds, etc., within their own tenant
// physician: Manages patients assigned to them
// nurse: Manages patient care within a tenant
export type Role = "super_admin" | "tenant_admin" | "physician" | "nurse";

// --- The User Object ---
// This represents the currently logged-in user.
// It would be populated from the JWT claims.
export type User = {
  id: string;
  tenantId: string | null; // Super admins might not belong to a single tenant
  roles: Role[];
};

// --- Defining the Resources and Actions ---
export type Permissions = {
  patients: {
    dataType: Patient;
    action: "view" | "create" | "update" | "discharge" | "assign_bed";
  };
  beds: {
    dataType: Bed;
    action: "view_all" | "create" | "update_status";
  };
  tenant_users: {
    dataType: TenantUser;
    action: "view_all" | "create" | "update_roles";
  };
  // The 'tenants' resource is special. Its dataType is not a TenantResource.
  tenants: {
      dataType: Tenant; 
      action: "create" | "view_all";
  }
};

export type PermissionRequirement = {
  [Resource in keyof Permissions]: {
    resource: Resource;
    action: Permissions[Resource]['action'];
  };
}[keyof Permissions];

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

// --- The Central Permission Configuration ---
const ROLES = {
  super_admin: {
    tenants: {
      create: true,
      view_all: true,
    },
  },
  tenant_admin: {
    patients: {
      create: true,
      view: true, // Can view all patients in their tenant
    },
    beds: {
      view_all: true,
      create: true,
      update_status: true,
    },
    tenant_users: {
      view_all: true,
      create: true,
      update_roles: true,
    },
  },
  physician: {
    patients: {
      // A physician can only view/update patients assigned to them
      view: (user, patient) => patient.assignedPhysicianId === user.id,
      update: (user, patient) => patient.assignedPhysicianId === user.id,
      discharge: (user, patient) => patient.assignedPhysicianId === user.id,
      assign_bed: (user, patient) => patient.assignedPhysicianId === user.id,
    },
    beds: {
      view_all: true, // Can see all bed statuses
    },
  },
  nurse: {
    patients: {
      view: true, // A nurse can view any patient in their tenant
      update: (user, patient) => !patient.isDischarged, // Can update records of non-discharged patients
    },
    beds: {
      view_all: true,
      update_status: true, // Can update if a bed is clean, needs cleaning, etc.
    },
  },
} as const satisfies RolesWithPermissions;

// A type guard function to check if an object is a TenantResource
function isTenantResource(data: any): data is TenantResource {
    return data && typeof data.tenantId === 'string';
}

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
): boolean {
  // Use the type guard for a safe tenancy check.
  // This check now only applies to resources that are expected to have a tenantId.
  if (isTenantResource(data) && user.tenantId && data.tenantId !== user.tenantId) {
    return false; // Security boundary
  }

  return user.roles.some((role) => {
    // ... rest of the function remains the same
    const permission = (ROLES as any)[role]?.[resource]?.[action];

    if (permission == null) {
      return false;
    }

    if (typeof permission === "boolean") {
      return permission;
    }
    
    if (data) {
      return permission(user, data);
    }
    
    return false;
  });
}