import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { EntityEnum } from '../../enums';
import { ChurchJoinRequestStatusEnum } from '../entities';

export class CreateChurchJoinRequestsTable1762311600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "church_join_request_status_enum" AS ENUM (${Object.values(ChurchJoinRequestStatusEnum).map((status) => `'${status}'`).join(', ')})
    `);

    await queryRunner.createTable(
      new Table({
        name: EntityEnum.CHURCH_JOIN_REQUEST,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
            isGenerated: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'church_id',
            type: 'uuid',
          },
          {
            name: 'status',
            type: 'church_join_request_status_enum',
            default: "'PENDING'",
          },
        ],
        uniques: [
          {
            name: 'church_join_request_unique',
            columnNames: ['user_id', 'church_id'],
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      EntityEnum.CHURCH_JOIN_REQUEST,
      new TableForeignKey({
        name: 'FK_ChurchJoinRequest_User',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityEnum.USER,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      EntityEnum.CHURCH_JOIN_REQUEST,
      new TableForeignKey({
        name: 'FK_ChurchJoinRequest_Church',
        columnNames: ['church_id'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityEnum.CHURCH,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(EntityEnum.CHURCH_JOIN_REQUEST, 'FK_ChurchJoinRequest_Church');
    await queryRunner.dropForeignKey(EntityEnum.CHURCH_JOIN_REQUEST, 'FK_ChurchJoinRequest_User');
    await queryRunner.dropTable(EntityEnum.CHURCH_JOIN_REQUEST);
    await queryRunner.query('DROP TYPE "church_join_request_status_enum"');
  }
}
