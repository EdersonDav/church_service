import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { EntityEnum } from "../../enums";

export class CreateSectorTable1736114101035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criação da tabela sector
        await queryRunner.createTable(
            new Table({
                name: EntityEnum.SECTOR,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        isUnique: true
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
                        name: 'deleted_at',
                        type: 'timestamp',
                        isNullable: true
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isUnique: true
                    },
                    {
                        name: 'church_id',
                        type: 'varchar',
                        isNullable: false // Alterar para true se for permitido ser nulo
                    }
                ],
            }),
            true,
        );

        // Adicionando a relação com a tabela church
        await queryRunner.createForeignKey(
            EntityEnum.SECTOR,
            new TableForeignKey({
                columnNames: ['church_id'],
                referencedTableName: EntityEnum.CHURCH, // Certifique-se de que EntityEnum.CHURCH exista
                referencedColumnNames: ['id'], // Supondo que a tabela church tenha a coluna 'id'
                onDelete: 'CASCADE', // Comportamento ao deletar um registro em church
                onUpdate: 'CASCADE', // Comportamento ao atualizar um registro em church
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(EntityEnum.SECTOR);
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('church_id'));
        if (foreignKey) {
            await queryRunner.dropForeignKey(EntityEnum.SECTOR, foreignKey);
        }

        await queryRunner.dropColumn(EntityEnum.SECTOR, 'church_id');

        await queryRunner.dropTable(EntityEnum.SECTOR);
    }

}
