import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { EntityEnum } from "../../enums";

export class AddBirthdayInUser1748702932067 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            EntityEnum.USER,
            new TableColumn({
                name: 'birthday',
                type: 'date',
                isNullable: true,
                default: null
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(EntityEnum.USER, 'birthday');
    }

}
