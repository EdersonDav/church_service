import { MigrationInterface, QueryRunner } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateUserSectorTable1755495697917 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "sector_role_enum" AS ENUM ('LEADER', 'MEMBER', 'ADMIN');
    `);
    await queryRunner.query(`
      CREATE TABLE ${EntityEnum.USER_SECTOR} (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "sector_id" uuid NOT NULL,
        "role" "sector_role_enum" NOT NULL DEFAULT 'MEMBER',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_sector" UNIQUE ("user_id", "sector_id"),
        CONSTRAINT "FK_user" FOREIGN KEY ("user_id") REFERENCES ${EntityEnum.USER}("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sector" FOREIGN KEY ("sector_id") REFERENCES ${EntityEnum.SECTOR}("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ${EntityEnum.USER_SECTOR}`);
    await queryRunner.query(`DROP TYPE "sector_role_enum"`);
  }

}
