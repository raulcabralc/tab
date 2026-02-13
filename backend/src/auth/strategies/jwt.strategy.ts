import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { WorkerService } from "src/worker/worker.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly workerService: WorkerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET") as string,
    });
  }

  async validate(payload: any) {
    const worker = await this.workerService.strictFindByEmail(payload.email);

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      restaurantId: payload.restaurant,
      isFirstLogin: worker?.isFirstLogin ?? payload.isFirstLogin,
    };
  }
}
