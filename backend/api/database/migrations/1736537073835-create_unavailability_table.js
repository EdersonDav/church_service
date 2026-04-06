"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUnavailabilityTable1736537073835 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateUnavailabilityTable1736537073835 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.UNAVAILABILITY,
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
                    isNullable: false
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false
                }
            ],
        }), true);
        await queryRunner.createForeignKey(enums_1.EntityEnum.UNAVAILABILITY, new typeorm_1.TableForeignKey({
            name: 'FK_Unavailability_User',
            columnNames: ['user_id'],
            referencedTableName: enums_1.EntityEnum.USER,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.UNAVAILABILITY, 'FK_Unavailability_User');
        await queryRunner.dropColumn(enums_1.EntityEnum.UNAVAILABILITY, 'user_id');
        await queryRunner.dropTable(enums_1.EntityEnum.UNAVAILABILITY);
    }
}
exports.CreateUnavailabilityTable1736537073835 = CreateUnavailabilityTable1736537073835;
//# sourceMappingURL=1736537073835-create_unavailability_table.js.map