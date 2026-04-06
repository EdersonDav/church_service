"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableTasks1735663631891 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateTableTasks1735663631891 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.TASK,
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
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'icon',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable(enums_1.EntityEnum.TASK);
    }
}
exports.CreateTableTasks1735663631891 = CreateTableTasks1735663631891;
//# sourceMappingURL=1735663631891-create_table_tasks.js.map