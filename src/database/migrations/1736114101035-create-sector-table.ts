import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateSectorTable1736114101035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: EntityEnum.SECTOR,
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
                        name: 'name',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'church_id',
                        type: 'uuid',
                        isNullable: false
                    }
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            EntityEnum.SECTOR,
            new TableForeignKey({
                name: 'FK_Sector_Church',
                columnNames: ['church_id'],
                referencedTableName: EntityEnum.CHURCH,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.SECTOR, 'FK_Sector_Church');

        await queryRunner.dropColumn(EntityEnum.SECTOR, 'church_id');

        await queryRunner.dropTable(EntityEnum.SECTOR);
    }

}
