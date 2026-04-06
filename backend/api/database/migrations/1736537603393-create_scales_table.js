"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScalesTable1736537603393 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateScalesTable1736537603393 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.SCALE,
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
                    name: 'date',
                    type: 'timestamp',
                    isNullable: true
                },
                {
                    name: 'sector_id',
                    type: 'uuid',
                    isNullable: false
                }
            ],
        }), true);
        await queryRunner.createForeignKey(enums_1.EntityEnum.SCALE, new typeorm_1.TableForeignKey({
            name: 'FK_Scale_Sector',
            columnNames: ['sector_id'],
            referencedTableName: enums_1.EntityEnum.SECTOR,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.SCALE, 'FK_Scale_Sector');
        await queryRunner.dropColumn(enums_1.EntityEnum.SCALE, 'sector_id');
        await queryRunner.dropTable(enums_1.EntityEnum.SCALE);
    }
}
exports.CreateScalesTable1736537603393 = CreateScalesTable1736537603393;
//# sourceMappingURL=1736537603393-create_scales_table.js.map