import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { EntityEnum } from '../../enums';

export class AddTitleToScales1767400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      EntityEnum.SCALE,
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: false,
        default: "'Escala'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(EntityEnum.SCALE, 'title');
  }
}
