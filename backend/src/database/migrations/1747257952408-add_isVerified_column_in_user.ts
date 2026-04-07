import { MigrationInterface, QueryRunner, TableColumn,  } from "typeorm";
import { EntityEnum } from "../../enums";

export class AddIsVerifiedColumnInUser1747257952408 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            EntityEnum.USER,
            new TableColumn({
                name: 'is_verified',
                type: 'boolean',
                isNullable: false,
                default: false
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(EntityEnum.USER, 'is_verified');
    }

}
