"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUniqueKeyOnUserChurch1749570877507 = void 0;
const enums_1 = require("../../enums");
class AddUniqueKeyOnUserChurch1749570877507 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "${enums_1.EntityEnum.USER_CHURCH}"
            ADD CONSTRAINT "user_church_unique" UNIQUE ("user_id", "church_id")
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "${enums_1.EntityEnum.USER_CHURCH}"
            DROP CONSTRAINT "user_church_unique"
        `);
    }
}
exports.AddUniqueKeyOnUserChurch1749570877507 = AddUniqueKeyOnUserChurch1749570877507;
//# sourceMappingURL=1749570877507-add_unique_key_on_user_church.js.map