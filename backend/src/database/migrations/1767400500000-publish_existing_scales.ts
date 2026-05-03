import { MigrationInterface, QueryRunner } from 'typeorm';
import { EntityEnum, ScaleStatusEnum } from '../../enums';

export class PublishExistingScales1767400500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "${EntityEnum.SCALE}" SET "status" = $1 WHERE "status" = $2`,
      [ScaleStatusEnum.PUBLISHED, ScaleStatusEnum.DRAFT],
    );
  }

  public async down(): Promise<void> {
    // Intentionally left empty to avoid changing user-authored visibility decisions.
  }
}
