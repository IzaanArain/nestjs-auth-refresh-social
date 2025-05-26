import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {};
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]); // we use reflector to extract the roles keys of the meta data
    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user;
    const hasRequiredRole = requiredRoles.some((role)=> user.role === role);
    return hasRequiredRole;
  }
}


