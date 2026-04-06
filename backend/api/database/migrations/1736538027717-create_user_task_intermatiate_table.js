"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTaskIntermatiateTable1736538027717 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateUserTaskIntermatiateTable1736538027717 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.USER_TASK,
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
                    name: "task_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isPrimary: true,
                }
            ],
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.USER_TASK, new typeorm_1.TableForeignKey({
            name: "FK_User_Task_User",
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.USER,
            onDelete: "CASCADE",
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.USER_TASK, new typeorm_1.TableForeignKey({
            name: "FK_User_Task_Task",
            columnNames: ["task_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.TASK,
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.USER_TASK, "FK_User_Task_User");
        await queryRunner.dropForeignKey(enums_1.EntityEnum.USER_TASK, "FK_User_Task_Task");
        await queryRunner.dropTable(enums_1.EntityEnum.USER_TASK);
    }
}
exports.CreateUserTaskIntermatiateTable1736538027717 = CreateUserTaskIntermatiateTable1736538027717;
//# sourceMappingURL=1736538027717-create_user_task_intermatiate_table.js.map