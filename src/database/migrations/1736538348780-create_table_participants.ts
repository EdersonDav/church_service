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
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isUnique: true,
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
                        name: "task_id",
                        type: "uuid",
                        isPrimary: true,
                    }
                ],
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.PARTICIPANTS,
            new TableForeignKey({
                name: "FK_Participants_User",
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.USER,
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.PARTICIPANTS,
            new TableForeignKey({
                name: "FK_Participants_User_Task",
                columnNames: ["task_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.TASK,
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            EntityEnum.PARTICIPANTS,
            new TableForeignKey({
                name: "FK_Participants_Scale",
                columnNames: ["scale_id"],
                referencedColumnNames: ["id"],
                referencedTableName: EntityEnum.SCALE,
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, "FK_Participants_User");
        await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, "FK_Participants_User_Task");
        await queryRunner.dropForeignKey(EntityEnum.PARTICIPANTS, "FK_Participants_Scale");
        await queryRunner.dropTable(EntityEnum.PARTICIPANTS);
    }

}
