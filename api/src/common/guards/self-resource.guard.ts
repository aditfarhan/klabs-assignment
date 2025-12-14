import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SelfResourceGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user;
        const resourceId = request.params.id;

        // If no user is authenticated, let the JWT guard handle it
        if (!user) {
            return false;
        }

        // Check if the authenticated user is trying to access their own resource
        if (String(user.id) !== resourceId) {
            return false;
        }

        return true;
    }
}
