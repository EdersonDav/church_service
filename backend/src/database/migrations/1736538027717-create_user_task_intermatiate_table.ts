import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateUserTaskIntermatiateTable1736538027717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.USER_TASK,
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
                        name: "task_id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                        isPrimary: true,
                    }
                ],
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.USER_TASK,
            new TableForeignKey({
                name: "FK_User_Task_User",
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.USER,
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.USER_TASK,
            new TableForeignKey({
                name: "FK_User_Task_Task",
                columnNames: ["task_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.TASK,
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.USER_TASK, "FK_User_Task_User");
        await queryRunner.dropForeignKey(EntityEnum.USER_TASK, "FK_User_Task_Task");
        await queryRunner.dropTable(EntityEnum.USER_TASK);
    }
}
