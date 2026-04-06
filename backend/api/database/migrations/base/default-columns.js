"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultColumns = void 0;
const typeorm_1 = require("typeorm");
class DefaultColumns {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'db-name',
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
                }
            ],
        }), true);
    }
}
exports.DefaultColumns = DefaultColumns;
//# sourceMappingURL=default-columns.js.map