"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTablePasswordResetTokens1748182153288 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateTablePasswordResetTokens1748182153288 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.PASSWORD_RESET_TOKEN,
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'token',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'expires_at',
                    type: 'timestamp',
                    isNullable: false,
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
            ],
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.PASSWORD_RESET_TOKEN, new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            name: 'FK_User_PasswordResetToken',
        }));
        await queryRunner.query(`ALTER TABLE "${enums_1.EntityEnum.PASSWORD_RESET_TOKEN}" ADD CONSTRAINT "UQ_User_Token" UNIQUE ("user_id", "token")`);
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.PASSWORD_RESET_TOKEN, 'UQ_User_Token');
        await queryRunner.dropForeignKey(enums_1.EntityEnum.PASSWORD_RESET_TOKEN, 'FK_User_PasswordResetToken');
        await queryRunner.dropTable(enums_1.EntityEnum.PASSWORD_RESET_TOKEN);
    }
}
exports.CreateTablePasswordResetTokens1748182153288 = CreateTablePasswordResetTokens1748182153288;
//# sourceMappingURL=1748182153288-create_table_password_reset_tokens.js.map