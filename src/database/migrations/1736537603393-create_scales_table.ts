import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateScalesTable1736537603393 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: EntityEnum.SCALE,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
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
                        name: 'date',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'sector_id',
                        type: 'varchar',
                        isNullable: false
                    }
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            EntityEnum.SCALE,
            new TableForeignKey({
                columnNames: ['sector_id'],
                referencedTableName: EntityEnum.SECTOR,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(EntityEnum.SCALE);
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('sector_id'));
        if (foreignKey) {
            await queryRunner.dropForeignKey(EntityEnum.SCALE, foreignKey);
        }

        await queryRunner.dropColumn(EntityEnum.SCALE, 'sector_id');

        await queryRunner.dropTable(EntityEnum.SCALE);
    }
}
