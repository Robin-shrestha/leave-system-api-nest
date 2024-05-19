import { Injectable } from '@nestjs/common';

import { Role } from 'src/types/enums';

interface IsAuthorizedParams {
  currentRole: Role;
  requiredRole: Role;
}

const roleHierarchies = new Map<string, Role[]>();
roleHierarchies.set('Default', [Role.USER, Role.MANAGER, Role.ADMIN]);

@Injectable()
export class AccessControlService {
  private hierarchies: Array<Map<string, number>> = [];

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_roleType, role] of roleHierarchies) {
      this.buildRoles(role);
    }
  }

  /**
   * The buildRoles method allows for creating a role hierarchy between specified set of roles.
   * Roles have to be specified from least privileged user to the most priviliged one
   * @param roles Array that contains list of roles
   */
  private buildRoles(roles: Role[]) {
    let priority = 1;
    const hierarchy: Map<string, number> = new Map();
    roles.forEach((role) => {
      hierarchy.set(role, priority);
      priority++;
    });
    this.hierarchies.push(hierarchy);
  }

  isAuthorized({ currentRole, requiredRole }: IsAuthorizedParams) {
    for (const hierarchy of this.hierarchies) {
      const priority = hierarchy.get(currentRole);
      const requiredPriority = hierarchy.get(requiredRole);
      if (priority && requiredPriority && priority >= requiredPriority) {
        return true;
      }
    }
    return false;
  }
}
