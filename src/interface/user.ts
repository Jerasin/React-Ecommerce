export interface PermissionInfo {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

export interface UserRole {
  name: string;
  description: string;
  permissionInfos: PermissionInfo[];
}

export interface UserInfo {
  // id: number;
  // createdAt: string;
  // updatedAt: string;
  // email: string;
  // username: string;
  // fullname: string;
  // avatar: string;
  // userRoleId: number;
  // userRole: UserRole;

  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  fullname: string;
  avatar: string;
  roleId: number;
  email: string;
  isActive: boolean;
  userRole: UserRole;
}

export interface UserProfile {
  id: number;
  username: string;
  fullname: string;
  avatar: string;
  roleId: number;
  userRole: UserRole;
  email: string;
  createdAt: string;
}
