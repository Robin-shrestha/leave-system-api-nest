import { AccessControlService } from './../accessControl.service';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/Public.decorator';
import { ROLES_KEY } from '../decorators/Roles.decorator';
import { JWTUser } from '../types/profile.type';
import { Role } from 'src/types/enums';

// checks if the user is authenticated and also weather they are authorized to access certain service
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly accessControlService: AccessControlService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if route is public -> can be accessed (no token required)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    //  checks if the access token is valid
    const isAuthenticated = await super.canActivate(context);

    if (!isAuthenticated) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<{
      user: JWTUser;
      [x: string]: unknown;
    }>();

    const userRole = req.user.role;

    if (!userRole) {
      throw new UnauthorizedException('user Not Authorized');
    }

    console.log({ userRole, requiredRoles });
    for (const role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: userRole,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
