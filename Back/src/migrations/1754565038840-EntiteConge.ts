import { MigrationInterface, QueryRunner } from "typeorm";

export class EntiteConge1754565038840 implements MigrationInterface {
    name = 'EntiteConge1754565038840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`conge\` (\`id_conge\` int NOT NULL AUTO_INCREMENT, \`matricule\` varchar(20) NOT NULL, \`motif\` varchar(100) NOT NULL, \`type\` enum ('ANNUEL', 'MALADIE', 'MATERNITE', 'PATERNITE', 'EXCEPTIONNEL', 'AUTRE') NOT NULL, \`nbr_jours_permis\` int NOT NULL, \`solde_conge\` int NOT NULL, \`date_depart\` date NOT NULL, \`date_reprise\` date NOT NULL, \`personne_interim\` varchar(20) NULL, PRIMARY KEY (\`id_conge\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`conge\` ADD CONSTRAINT \`FK_5392ce2b1182de11fb431694432\` FOREIGN KEY (\`matricule\`) REFERENCES \`user\`(\`matricule\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`conge\` DROP FOREIGN KEY \`FK_5392ce2b1182de11fb431694432\``);
        await queryRunner.query(`DROP TABLE \`conge\``);
    }

}
