import { Injectable } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  handleRequest(err, user, info) {
    return user;
  }
}