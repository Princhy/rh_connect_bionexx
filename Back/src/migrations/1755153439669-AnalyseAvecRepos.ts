import { MigrationInterface, QueryRunner } from "typeorm";

export class AnalyseAvecRepos1755153439669 implements MigrationInterface {
    name = 'AnalyseAvecRepos1755153439669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` CHANGE \`statut_final\` \`statut_final\` enum ('present', 'retard', 'absent', 'sortie_anticipee', 'present_avec_retard', 'en_conge', 'EN_REPOS') NOT NULL DEFAULT 'absent'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`analyse\` CHANGE \`statut_final\` \`statut_final\` enum ('present', 'retard', 'absent', 'sortie_anticipee', 'present_avec_retard', 'en_conge') NOT NULL DEFAULT 'absent'`);
    }

}
