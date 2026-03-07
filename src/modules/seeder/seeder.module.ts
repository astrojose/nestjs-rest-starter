import { Module } from '@nestjs/common';
import { SeederService } from 'src/modules/seeder/seeder.service';
import { RolesModule } from 'src/modules/roles/roles.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [RolesModule, UsersModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
