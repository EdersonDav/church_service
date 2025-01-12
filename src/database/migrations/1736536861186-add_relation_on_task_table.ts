import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";
import { EntityEnum } from "../../enums";

export class AddRelationOnTaskTable1736536861186 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            EntityEnum.TASK,
            new TableColumn({
                name: 'sector_id',
                type: 'varchar',
                isNullable: false
            })
        )
        await queryRunner.createForeignKey(
            EntityEnum.TASK,
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
        const table = await queryRunner.getTable(EntityEnum.TASK);
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('sector_id'));
        if (foreignKey) {
            await queryRunner.dropForeignKey(EntityEnum.SECTOR, foreignKey);
        }

        await queryRunner.dropColumn(EntityEnum.SECTOR, 'sector_id');
    }

}
