import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLieuTravailToAnalyse1755672434135 implements MigrationInterface {
    name = 'AddLieuTravailToAnalyse1755672434135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` ADD \`lieu_travail\` VARCHAR(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` DROP COLUMN \`lieu_travail\``);
    }
}
