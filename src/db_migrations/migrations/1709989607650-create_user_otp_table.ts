import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserOtpTable1709989607650 implements MigrationInterface {
  name = 'CreateUserOtpTable1709989607650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_otp" ("id" SERIAL NOT NULL, "otp" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_494c022ed33e6ee19a2bbb11b22" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_otp"`);
  }
}
