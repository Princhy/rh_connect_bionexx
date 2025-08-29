import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartementIdToConge1755672434136 implements MigrationInterface {
    name = 'AddDepartementIdToConge1755672434136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conge\` ADD \`departement_id\` INT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conge\` DROP COLUMN \`departement_id\``);
    }
}
