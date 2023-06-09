import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertRootInUser1685391971656 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            INSERT INTO public."user"(
                name, email, cpf, type_user, phone, password)
                VALUES ('root', 'root2@root.com', '12345678901', 4, '31925325252', '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM public."user"
                WHERE email like 'root@root.com';
        `);
    }

}
