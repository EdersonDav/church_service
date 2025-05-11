import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateUnavailabilityTable1736537073835 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: EntityEnum.UNAVAILABILITY,
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
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'date',
                        type: 'timestamp',
                        isNullable: false
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false
                    }
                ],
            }),
            true,
        );


        await queryRunner.createForeignKey(
            EntityEnum.UNAVAILABILITY,
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: EntityEnum.USER,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(EntityEnum.UNAVAILABILITY);
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('user_id'));
        if (foreignKey) {
            await queryRunner.dropForeignKey(EntityEnum.UNAVAILABILITY, foreignKey);
        }

        await queryRunner.dropColumn(EntityEnum.UNAVAILABILITY, 'user_id');

        await queryRunner.dropTable(EntityEnum.UNAVAILABILITY);
    }

}
