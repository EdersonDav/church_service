"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1733608780250 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateUserTable1733608780250 {
    async up(queryRunner) {
        await queryRunner.query('DROP EXTENSION "uuid-ossp"');
        await queryRunner.query('CREATE EXTENSION "uuid-ossp"');
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.USER,
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
                    name: 'email',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'name',
                    type: 'varchar',
                }
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable(enums_1.EntityEnum.USER);
    }
}
exports.CreateUserTable1733608780250 = CreateUserTable1733608780250;
//# sourceMappingURL=1733608780250-create_users_table.js.map