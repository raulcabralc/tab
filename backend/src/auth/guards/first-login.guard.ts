import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class FirstLoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const path = request.route.path;

    if (user?.isFirstLogin && !path.includes("update-pin")) {
      throw new ForbiddenException(
        "You must change your password in your first access",
      );
    }

    return true;
  }
}
