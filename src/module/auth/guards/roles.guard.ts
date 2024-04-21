import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/Roles.decorator';
import { tokenUtils } from 'src/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = tokenUtils.extractTokenFromHeader(request);

    const tokenPayload = this.jwtService.decode(token);
    const userRoles = tokenPayload.roles;
    const allowedAccess = this.hasAccess(userRoles, requiredRoles);
    if (!allowedAccess) {
      throw new UnauthorizedException(
        'Insufficient permissions. Access not allowed!',
      );
    }

    return true;
  }

  private hasAccess(userRoles: Role[], requiredRoles: Role[]) {
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
