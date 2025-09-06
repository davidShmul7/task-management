import { TaskStatus } from '../task-status.enum';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class GetTasksFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
