import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { EntityEnum } from '../../enums';

export class AddDescriptionToScales1767400200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      EntityEnum.SCALE,
      new TableColumn({
        name: 'description',
        type: 'text',
        isNullable: false,
        default: "''",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(EntityEnum.SCALE, 'description');
  }
}
