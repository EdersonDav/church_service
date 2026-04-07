import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateTableExtraEvents1762286400000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.EXTRA_EVENT,
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
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'date',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'church_id',
                        type: 'uuid',
                        isNullable: false,
                    }
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            EntityEnum.EXTRA_EVENT,
            new TableForeignKey({
                name: 'FK_ExtraEvent_Church',
                columnNames: ['church_id'],
                referencedTableName: EntityEnum.CHURCH,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.EXTRA_EVENT, 'FK_ExtraEvent_Church');
        await queryRunner.dropTable(EntityEnum.EXTRA_EVENT);
    }
}
