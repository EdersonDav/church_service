"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSectorTable1736114101035 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateSectorTable1736114101035 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.SECTOR,
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
                },
                {
                    name: 'church_id',
                    type: 'uuid',
                    isNullable: false
                }
            ],
        }), true);
        await queryRunner.createForeignKey(enums_1.EntityEnum.SECTOR, new typeorm_1.TableForeignKey({
            name: 'FK_Sector_Church',
            columnNames: ['church_id'],
            referencedTableName: enums_1.EntityEnum.CHURCH,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.SECTOR, 'FK_Sector_Church');
        await queryRunner.dropColumn(enums_1.EntityEnum.SECTOR, 'church_id');
        await queryRunner.dropTable(enums_1.EntityEnum.SECTOR);
    }
}
exports.CreateSectorTable1736114101035 = CreateSectorTable1736114101035;
//# sourceMappingURL=1736114101035-create-sector-table.js.map