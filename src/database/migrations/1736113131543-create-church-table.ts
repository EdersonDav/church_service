import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateChurchTable1736113131543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.CHURCH,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isUnique: true,
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
                    }
                ],
            }),
            true,
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(EntityEnum.CHURCH)
    }

}
