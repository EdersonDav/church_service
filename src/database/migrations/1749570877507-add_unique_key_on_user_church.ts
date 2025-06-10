import { MigrationInterface, QueryRunner } from "typeorm";
import { EntityEnum } from "../../enums";

export class AddUniqueKeyOnUserChurch1749570877507 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "${EntityEnum.USER_CHURCH}"
            ADD CONSTRAINT "user_church_unique" UNIQUE ("user_id", "church_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "${EntityEnum.USER_CHURCH}"
            DROP CONSTRAINT "user_church_unique"
        `);
    }

}
