"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChurchTable1736113131543 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateChurchTable1736113131543 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.CHURCH,
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
                    name: 'name',
                    type: 'varchar',
                    isUnique: true
                }
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable(enums_1.EntityEnum.CHURCH);
    }
}
exports.CreateChurchTable1736113131543 = CreateChurchTable1736113131543;
//# sourceMappingURL=1736113131543-create-church-table.js.map