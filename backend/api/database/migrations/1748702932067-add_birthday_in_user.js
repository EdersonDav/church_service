"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBirthdayInUser1748702932067 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class AddBirthdayInUser1748702932067 {
    async up(queryRunner) {
        await queryRunner.addColumn(enums_1.EntityEnum.USER, new typeorm_1.TableColumn({
            name: 'birthday',
            type: 'date',
            isNullable: true,
            default: null
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn(enums_1.EntityEnum.USER, 'birthday');
    }
}
exports.AddBirthdayInUser1748702932067 = AddBirthdayInUser1748702932067;
//# sourceMappingURL=1748702932067-add_birthday_in_user.js.map