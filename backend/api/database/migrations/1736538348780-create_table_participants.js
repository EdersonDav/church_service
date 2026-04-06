"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableParticipants1736538348780 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class CreateTableParticipants1736538348780 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: enums_1.EntityEnum.PARTICIPANTS,
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
                    name: "scale_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "user_id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "task_id",
                    type: "uuid",
                    isPrimary: true,
                }
            ],
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.PARTICIPANTS, new typeorm_1.TableForeignKey({
            name: "FK_Participants_User",
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.USER,
            onDelete: "CASCADE",
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.PARTICIPANTS, new typeorm_1.TableForeignKey({
            name: "FK_Participants_User_Task",
            columnNames: ["task_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.TASK,
            onDelete: "CASCADE",
        }));
        await queryRunner.createForeignKey(enums_1.EntityEnum.PARTICIPANTS, new typeorm_1.TableForeignKey({
            name: "FK_Participants_Scale",
            columnNames: ["scale_id"],
            referencedColumnNames: ["id"],
            referencedTableName: enums_1.EntityEnum.SCALE,
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey(enums_1.EntityEnum.PARTICIPANTS, "FK_Participants_User");
        await queryRunner.dropForeignKey(enums_1.EntityEnum.PARTICIPANTS, "FK_Participants_User_Task");
        await queryRunner.dropForeignKey(enums_1.EntityEnum.PARTICIPANTS, "FK_Participants_Scale");
        await queryRunner.dropTable(enums_1.EntityEnum.PARTICIPANTS);
    }
}
exports.CreateTableParticipants1736538348780 = CreateTableParticipants1736538348780;
//# sourceMappingURL=1736538348780-create_table_participants.js.map