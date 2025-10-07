//#region import
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StartTimingMiddleware } from './common/middlewares/start-timing.middleware';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from './modules/otp/otp.module';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheConfig, jwtConfig } from './config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './modules/redis/redis.module';
import { RabbitmqModule } from './modules/rabbitmq/rabbitmq.module';
//#endregion

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync(jwtConfig),
    CacheModule.registerAsync(cacheConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    OtpModule,
    RedisModule,
    RabbitmqModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(StartTimingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
