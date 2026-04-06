"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableVerificationCode1747258200848 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateTableVerificationCode1747258200848 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.VERIFICATION_CODE,
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
                    name: 'expires_at',
                    type: 'timestamp',
                    isNullable: false
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false
                },
                {
                    name: 'code',
                    type: 'varchar',
                    isNullable: false
                }
            ],
        }), true);
        await queryRunner.createForeignKey(enums_1.EntityEnum.VERIFICATION_CODE, new typeorm_1.TableForeignKey({
            name: 'FK_User_Code',
            columnNames: ['user_id'],
            referencedTableName: enums_1.EntityEnum.USER,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.query(`ALTER TABLE "${enums_1.EntityEnum.VERIFICATION_CODE}" ADD CONSTRAINT "UQ_User_Code" UNIQUE ("user_id", "code")`);
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.VERIFICATION_CODE, 'UQ_User_Code');
        await queryRunner.dropForeignKey(enums_1.EntityEnum.VERIFICATION_CODE, 'FK_User_Code');
        await queryRunner.dropTable(enums_1.EntityEnum.VERIFICATION_CODE);
    }
}
exports.CreateTableVerificationCode1747258200848 = CreateTableVerificationCode1747258200848;
//# sourceMappingURL=1747258200848-create_table_verification_code.js.map