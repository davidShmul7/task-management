import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { DataSource } from 'typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksRepository,
      useFactory: (dataSource: DataSource) => new TasksRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class TasksModule {}
