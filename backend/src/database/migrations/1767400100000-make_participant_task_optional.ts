import { MigrationInterface, QueryRunner, TableForeignKey, TableUnique } from 'typeorm';
import { EntityEnum } from '../../enums';

export class MakeParticipantTaskOptional1767400100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(EntityEnum.PARTICIPANTS);

    const taskForeignKey = table?.foreignKeys.find((key) => key.name === 'FK_Participants_User_Task');
    if (taskForeignKey) {
      await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, taskForeignKey);
    }

    const primaryColumns = table?.primaryColumns.map((column) => column.name) ?? [];
    if (primaryColumns.includes('task_id')) {
      await queryRunner.dropPrimaryKey(EntityEnum.PARTICIPANTS);
      await queryRunner.createPrimaryKey(EntityEnum.PARTICIPANTS, ['id']);
    }

    for (const unique of table?.uniques ?? []) {
      if (
        unique.columnNames.includes('scale_id') &&
        unique.columnNames.includes('user_id') &&
        unique.columnNames.includes('task_id')
      ) {
        await queryRunner.dropUniqueConstraint(EntityEnum.PARTICIPANTS, unique);
      }
    }

    await queryRunner.query(`ALTER TABLE "${EntityEnum.PARTICIPANTS}" ALTER COLUMN "task_id" DROP NOT NULL`);

    await queryRunner.createUniqueConstraint(
      EntityEnum.PARTICIPANTS,
      new TableUnique({
        name: 'UQ_participants_scale_user',
        columnNames: ['scale_id', 'user_id'],
      }),
    );

    await queryRunner.createForeignKey(
      EntityEnum.PARTICIPANTS,
      new TableForeignKey({
        name: 'FK_Participants_User_Task',
        columnNames: ['task_id'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityEnum.TASK,
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(EntityEnum.PARTICIPANTS);

    const taskForeignKey = table?.foreignKeys.find((key) => key.name === 'FK_Participants_User_Task');
    if (taskForeignKey) {
      await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, taskForeignKey);
    }

    const scaleUserUnique = table?.uniques.find((unique) => unique.name === 'UQ_participants_scale_user');
    if (scaleUserUnique) {
      await queryRunner.dropUniqueConstraint(EntityEnum.PARTICIPANTS, scaleUserUnique);
    }

    await queryRunner.query(`ALTER TABLE "${EntityEnum.PARTICIPANTS}" ALTER COLUMN "task_id" SET NOT NULL`);

    const primaryColumns = table?.primaryColumns.map((column) => column.name) ?? [];
    if (primaryColumns.length === 1 && primaryColumns[0] === 'id') {
      await queryRunner.dropPrimaryKey(EntityEnum.PARTICIPANTS);
      await queryRunner.createPrimaryKey(EntityEnum.PARTICIPANTS, ['id', 'scale_id', 'user_id', 'task_id']);
    }

    await queryRunner.createUniqueConstraint(
      EntityEnum.PARTICIPANTS,
      new TableUnique({
        name: 'UQ_participants_scale_user_task',
        columnNames: ['scale_id', 'user_id', 'task_id'],
      }),
    );

    await queryRunner.createForeignKey(
      EntityEnum.PARTICIPANTS,
      new TableForeignKey({
        name: 'FK_Participants_User_Task',
        columnNames: ['task_id'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityEnum.TASK,
        onDelete: 'CASCADE',
      }),
    );
  }
}
