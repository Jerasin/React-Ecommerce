import { create } from "zustand";

interface UserRolePermissionInfoStore {
  id: number;
  name: string;
}

interface UserRoleInfoStore {
  name: string;
  description: string;
  permissionInfos: UserRolePermissionInfoStore[];
}

export interface UserInfoStore {
  username: string;
  id: number;
  roleId: number;
  userRole: UserRoleInfoStore;
}

interface UserStore {
  user: UserInfoStore | null;
  setUser: (user: UserInfoStore) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
