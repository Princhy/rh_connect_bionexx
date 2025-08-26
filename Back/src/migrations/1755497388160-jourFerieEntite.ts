import { MigrationInterface, QueryRunner } from "typeorm";

export class JourFerieEntite1755497388160 implements MigrationInterface {
    name = 'JourFerieEntite1755497388160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`jour_ferie\` (\`id_jourferie\` int NOT NULL AUTO_INCREMENT, \`nom\` varchar(100) NOT NULL, \`date\` date NOT NULL, \`recurrent\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id_jourferie\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`jour_ferie\``);
    }

}
