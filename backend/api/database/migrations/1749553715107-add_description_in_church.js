"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDescriptionInChurch1749553715107 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class AddDescriptionInChurch1749553715107 {
    async up(queryRunner) {
        await queryRunner.addColumn(enums_1.EntityEnum.CHURCH, new typeorm_1.TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
            default: null
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn(enums_1.EntityEnum.CHURCH, 'description');
    }
}
exports.AddDescriptionInChurch1749553715107 = AddDescriptionInChurch1749553715107;
//# sourceMappingURL=1749553715107-add_description_in_church.js.map