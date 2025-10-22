import { IsNotEmpty, IsString, IsOptional, IsArray, IsUUID, IsEnum } from 'class-validator';
import { RoleType } from '../enums';

export class CreateRoleDto {
  @IsEnum(RoleType)
  @IsNotEmpty()
  name!: RoleType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  permissions!: string[];
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
