export interface IOrganization {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface IUpdateOrganizationRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}
