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
                        name: 'date',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'sector_id',
                        type: 'uuid',
                        isNullable: false
                    }
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            EntityEnum.SCALE,
            new TableForeignKey({
                name: 'FK_Scale_Sector',
                columnNames: ['sector_id'],
                referencedTableName: EntityEnum.SECTOR,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.SCALE, 'FK_Scale_Sector');

        await queryRunner.dropColumn(EntityEnum.SCALE, 'sector_id');

        await queryRunner.dropTable(EntityEnum.SCALE);
    }
}
