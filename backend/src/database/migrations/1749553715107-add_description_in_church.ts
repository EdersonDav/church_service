import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { EntityEnum } from "../../enums";

export class AddDescriptionInChurch1749553715107 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            EntityEnum.CHURCH,
            new TableColumn({
                name: 'description',
                type: 'text',
                isNullable: true,
                default: null
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(EntityEnum.CHURCH, 'description');
    }

}
