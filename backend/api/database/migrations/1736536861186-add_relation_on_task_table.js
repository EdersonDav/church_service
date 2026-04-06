"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRelationOnTaskTable1736536861186 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class AddRelationOnTaskTable1736536861186 {
    async up(queryRunner) {
        await queryRunner.addColumn(enums_1.EntityEnum.TASK, new typeorm_1.TableColumn({
            name: 'sector_id',
            type: 'uuid',
            isNullable: false
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.TASK, new typeorm_1.TableForeignKey({
            name: 'FK_Task_Sector',
            columnNames: ['sector_id'],
            referencedTableName: enums_1.EntityEnum.SECTOR,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.TASK, 'FK_Task_Sector');
        await queryRunner.dropColumn(enums_1.EntityEnum.TASK, 'sector_id');
    }
}
exports.AddRelationOnTaskTable1736536861186 = AddRelationOnTaskTable1736536861186;
//# sourceMappingURL=1736536861186-add_relation_on_task_table.js.map