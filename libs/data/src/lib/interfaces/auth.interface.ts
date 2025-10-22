export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
  organizationId: string;
  roleId: string;
}

export interface ILoginResponse {
  access_token: string;
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  roleId: string;
  isActive: boolean;
  role: {
    name: string;
    permissions: Array<{ name: string }>;
  };
  organization: {
    name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserRequest {
  email: string;
  name: string;
  organizationId: string;
  roleId: string;
  password?: string;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  roleId?: string;
  isActive?: boolean;
}
