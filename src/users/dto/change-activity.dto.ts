import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeActivityDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
