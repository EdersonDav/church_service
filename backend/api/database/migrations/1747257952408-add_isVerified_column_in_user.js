"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsVerifiedColumnInUser1747257952408 = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../enums");
class AddIsVerifiedColumnInUser1747257952408 {
    async up(queryRunner) {
        await queryRunner.addColumn(enums_1.EntityEnum.USER, new typeorm_1.TableColumn({
            name: 'is_verified',
            type: 'boolean',
            isNullable: false,
            default: false
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn(enums_1.EntityEnum.USER, 'is_verified');
    }
}
exports.AddIsVerifiedColumnInUser1747257952408 = AddIsVerifiedColumnInUser1747257952408;
//# sourceMappingURL=1747257952408-add_isVerified_column_in_user.js.map