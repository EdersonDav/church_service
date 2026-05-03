import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { EntityEnum, ScaleStatusEnum } from '../../enums';

export class AddStatusToScales1767400400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      EntityEnum.SCALE,
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: false,
        default: `'${ScaleStatusEnum.DRAFT}'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(EntityEnum.SCALE, 'status');
  }
}
