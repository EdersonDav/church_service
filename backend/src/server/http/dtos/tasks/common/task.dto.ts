import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
    @Expose()
    @ApiProperty({ example: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23', description: 'Task identifier' })
    id!: string;

    @Expose()
    @ApiProperty({ example: 'Minister', description: 'Task name' })
    name!: string;

    @Expose()
    @ApiProperty({ example: 'https://example.com/icon.png', description: 'Icon image url', required: false })
    icon?: string;

    @Expose()
    @ApiProperty({ example: 'Responsible for leading worship', description: 'Task description', required: false })
    description?: string;

    @Expose()
    @ApiProperty({ example: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5', description: 'Sector identifier' })
    sector_id!: string;
}
