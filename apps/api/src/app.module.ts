import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { envValidationSchema } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './roles/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        const envName = `.env.${process.env.NODE_ENV ?? 'development'}`;
        return [
          join(process.cwd(), envName),
          join(process.cwd(), '.env'),
          join(process.cwd(), 'apps/api', envName),
          join(process.cwd(), 'apps/api', '.env'),
          join(__dirname, `../${envName}`),
          join(__dirname, '../.env'),
        ];
      })(),
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_NAME', 'cmp'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
