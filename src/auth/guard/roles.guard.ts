import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../roles.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not autheniticated');

    const userRoles: string[] = Array.isArray(user.roles)
      ? user.roles
      : user.role
        ? [user.role]
        : [];

    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) throw new ForbiddenException('Insufficient role(s)!');

    return true;
  }
}
