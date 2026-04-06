"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserChurchIntermediateTable1746978800235 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateUserChurchIntermediateTable1746978800235 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "role_enum" AS ENUM (${Array.from(Object.keys(enums_1.ChurchRoleEnum)).map((role) => `'${role}'`).join(', ')})
        `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.USER_CHURCH,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
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
                    name: "user_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "church_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: 'role',
                    type: 'role_enum',
                }
            ],
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.USER_CHURCH, new typeorm_1.TableForeignKey({
            name: "FK_User_Church_User",
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.USER,
            onDelete: "CASCADE",
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.USER_CHURCH, new typeorm_1.TableForeignKey({
            name: "FK_User_Church_Church",
            columnNames: ["church_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.CHURCH,
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.USER_CHURCH, "FK_User_Church_User");
        await queryRunner.dropForeignKey(enums_1.EntityEnum.USER_CHURCH, "FK_User_Church_Church");
        await queryRunner.dropTable(enums_1.EntityEnum.USER_CHURCH);
        await queryRunner.query('DROP TYPE "role_enum"');
    }
}
exports.CreateUserChurchIntermediateTable1746978800235 = CreateUserChurchIntermediateTable1746978800235;
//# sourceMappingURL=1746978800235-create_user_church_intermediate_table.js.map