import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ScaleParticipantDto {
    @Expose()
    @ApiProperty({ example: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da', description: 'User identifier' })
    user_id!: string;

    @Expose()
    @ApiProperty({ example: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39', description: 'Task identifier' })
    task_id!: string;

    @Expose()
    @ApiProperty({ example: 'Minister', required: false })
    task_name?: string;

    @Expose()
    @ApiProperty({ example: 'Jane Doe', required: false })
    user_name?: string;
}
