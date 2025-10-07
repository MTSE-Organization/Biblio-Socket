import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { OtpModule } from '../otp/otp.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, JwtStrategy, JwtAuthGuard],
  imports: [OtpModule],
  exports: [JwtAuthGuard]
})
export class AuthModule {}
