import { StringUtil } from '@/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from './user-session';

@Injectable()
export class AuthService {
  private readonly jwtSecrect: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.jwtSecrect = this.configService.get<string>('JWT_SECRET')!;
  }

  fromToken(token: string) {
    if (StringUtil.isEmpty(token)) return null;
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.jwtSecrect
      });

      const userId = payload.id;
      const kind = payload.kind;
      if (!userId || !kind) {
        return null;
      }

      return new UserSession(userId, payload.kind);
    } catch (err: any) {
      return null;
    }
  }
}
