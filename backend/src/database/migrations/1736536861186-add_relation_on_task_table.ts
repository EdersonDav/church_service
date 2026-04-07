import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";
import { EntityEnum } from "../../enums";

export class AddRelationOnTaskTable1736536861186 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            EntityEnum.TASK,
            new TableColumn({
                name: 'sector_id',
                type: 'uuid',
                isNullable: false
            })
        )
        await queryRunner.createForeignKey(
            EntityEnum.TASK,
            new TableForeignKey({
                name: 'FK_Task_Sector',
                columnNames: ['sector_id'],
                referencedTableName: EntityEnum.SECTOR,
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EntityEnum.TASK, 'FK_Task_Sector');

        await queryRunner.dropColumn(EntityEnum.TASK, 'sector_id');
    }

}
