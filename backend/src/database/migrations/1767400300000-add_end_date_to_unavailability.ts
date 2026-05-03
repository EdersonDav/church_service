import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { EntityEnum } from '../../enums';

export class AddEndDateToUnavailability1767400300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      EntityEnum.UNAVAILABILITY,
      new TableColumn({
        name: 'end_date',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.query(`UPDATE "${EntityEnum.UNAVAILABILITY}" SET "end_date" = "date" WHERE "end_date" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(EntityEnum.UNAVAILABILITY, 'end_date');
  }
}
