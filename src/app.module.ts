import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { AttributeModule } from './attribute/attribute.module';
import { GroupsModule } from './groups/groups.module';
import { ChatModule } from './chat/chat.module';
import { HeroModule } from './hero/hero.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { BlogModule } from './blog/blog.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // ❗ Disable in production
      }),
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: `"enyee" <${process.env.EMAIL_USER}>`,
      },
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    AttributeModule,
    GroupsModule,
    ChatModule,
    HeroModule,
    OrderModule,
    CartModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
