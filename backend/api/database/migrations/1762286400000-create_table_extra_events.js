"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableExtraEvents1762286400000 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateTableExtraEvents1762286400000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.EXTRA_EVENT,
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
                    isNullable: false,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'type',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'date',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'church_id',
                    type: 'uuid',
                    isNullable: false,
                }
            ],
        }), true);
        await queryRunner.createForeignKey(enums_1.EntityEnum.EXTRA_EVENT, new typeorm_1.TableForeignKey({
            name: 'FK_ExtraEvent_Church',
            columnNames: ['church_id'],
            referencedTableName: enums_1.EntityEnum.CHURCH,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.EXTRA_EVENT, 'FK_ExtraEvent_Church');
        await queryRunner.dropTable(enums_1.EntityEnum.EXTRA_EVENT);
    }
}
exports.CreateTableExtraEvents1762286400000 = CreateTableExtraEvents1762286400000;
//# sourceMappingURL=1762286400000-create_table_extra_events.js.map