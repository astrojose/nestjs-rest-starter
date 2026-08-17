import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private readonly isEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isEnabled = this.configService.get<boolean>('redis.enabled', true);
  }

  onModuleInit() {
    if (!this.isEnabled) {
      this.logger.log('Redis is disabled via configuration.');
      return;
    }

    const host = this.configService.get<string>('redis.host', 'localhost');
    const port = this.configService.get<number>('redis.port', 6379);
    const password = this.configService.get<string>('redis.password');

    this.logger.log(`Connecting to Redis at ${host}:${port}...`);

    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy: times => {
        const delay = Math.min(times * 100, 3000);
        this.logger.warn(`Redis connection retry #${times} in ${delay}ms`);
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.log('Redis connected successfully');
    });

    this.client.on('error', err => {
      this.isConnected = false;
      this.logger.error(`Redis error: ${err.message}`);
    });

    this.client.connect().catch(err => {
      this.logger.warn(`Initial Redis connection failed: ${err.message}`);
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  get isAvailable(): boolean {
    return this.isEnabled && this.isConnected && this.client !== null;
  }

  async setRolePermissions(
    roleName: string,
    permissions: string[],
  ): Promise<void> {
    if (!this.isAvailable || !this.client) return;
    try {
      const key = `role:${roleName}`;
      await this.client.del(key);
      if (permissions.length > 0) {
        await this.client.sadd(key, ...permissions);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to set role permissions in Redis: ${message}`);
    }
  }

  async isPermissionInRole(
    roleName: string,
    permission: string,
  ): Promise<boolean | null> {
    if (!this.isAvailable || !this.client) return null;
    try {
      const key = `role:${roleName}`;
      const result = await this.client.sismember(key, permission);
      return result === 1;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to check role permission in Redis: ${message}`);
      return null;
    }
  }

  async blacklistToken(token: string, ttlSeconds: number): Promise<void> {
    if (!this.isAvailable || !this.client || ttlSeconds <= 0) return;
    try {
      const key = `blacklist:${token}`;
      await this.client.setex(key, ttlSeconds, '1');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to blacklist token in Redis: ${message}`);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!this.isAvailable || !this.client) return false;
    try {
      const key = `blacklist:${token}`;
      const result = await this.client.get(key);
      return result === '1';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to check token blacklist in Redis: ${message}`);
      return false;
    }
  }
}
