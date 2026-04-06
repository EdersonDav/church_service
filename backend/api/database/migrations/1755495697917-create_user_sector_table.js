"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserSectorTable1755495697917 = void 0;
const enums_1 = require("../../enums");
class CreateUserSectorTable1755495697917 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "sector_role_enum" AS ENUM ('LEADER', 'MEMBER', 'ADMIN');
    `);
        await queryRunner.query(`
      CREATE TABLE ${enums_1.EntityEnum.USER_SECTOR} (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "sector_id" uuid NOT NULL,
        "role" "sector_role_enum" NOT NULL DEFAULT 'MEMBER',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_sector" UNIQUE ("user_id", "sector_id"),
        CONSTRAINT "FK_user" FOREIGN KEY ("user_id") REFERENCES ${enums_1.EntityEnum.USER}("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sector" FOREIGN KEY ("sector_id") REFERENCES ${enums_1.EntityEnum.SECTOR}("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE ${enums_1.EntityEnum.USER_SECTOR}`);
        await queryRunner.query(`DROP TYPE "sector_role_enum"`);
    }
}
exports.CreateUserSectorTable1755495697917 = CreateUserSectorTable1755495697917;
//# sourceMappingURL=1755495697917-create_user_sector_table.js.map