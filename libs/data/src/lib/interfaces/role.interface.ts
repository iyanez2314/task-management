export interface IRole {
  id: string;
  name: string;
  description?: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPermission {
  id: string;
  name: string;
  description?: string;
}

export interface ICreateRoleRequest {
  name: string;
  description?: string;
  permissions: string[];
}

export interface IUpdateRoleRequest {
  name?: string;
  description?: string;
}
