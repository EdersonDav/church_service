import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateTableParticipants1736538348780 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.PARTICIPANTS,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        generationStrategy: 'uuid',
                        isUnique: true
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
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: "scale_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "task",
                        type: "uuid",
                        isPrimary: true,
                    }
                ],
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.PARTICIPANTS,
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.USER,
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.PARTICIPANTS,
            new TableForeignKey({
                columnNames: ["task_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.TASK,
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.PARTICIPANTS,
            new TableForeignKey({
                columnNames: ["scale_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.SCALE,
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(EntityEnum.PARTICIPANTS);
        const userForeignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        const scaleForeignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("scale_id") !== -1);
        const taskForeignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("task_id") !== -1);
        if (userForeignKey) await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, userForeignKey);
        if (scaleForeignKey) await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, scaleForeignKey);
        if (taskForeignKey) await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, taskForeignKey);

        await queryRunner.dropTable(EntityEnum.PARTICIPANTS);
    }

}
