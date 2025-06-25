import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const args = ctx.getArgs();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has access to the company
    const companyId = args.companyId || args.input?.companyId;
    
    if (companyId && user.companyId !== companyId) {
      throw new ForbiddenException('Access denied to this company');
    }

    return true;
  }
}