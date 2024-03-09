import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1709990268913 implements MigrationInterface {
  name = 'CreateUserTable1709990268913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email_address" character varying, "phone_number" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "billing_address_id" integer, "shipping_address_id" integer, "user_otp_id" integer, "role_id" integer, "is_active" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "REL_aa750a5d4a0f0cc8d7ae8055aa" UNIQUE ("billing_address_id"), CONSTRAINT "REL_5c80e24caacfe9c6158b1fcafa" UNIQUE ("shipping_address_id"), CONSTRAINT "REL_d864090ed6e27b03db1eee6eaf" UNIQUE ("user_otp_id"), CONSTRAINT "REL_fb2e442d14add3cefbdf33c456" UNIQUE ("role_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_billing_address_id" FOREIGN KEY ("billing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_shipping_address_id" FOREIGN KEY ("shipping_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_otp_id" FOREIGN KEY ("user_otp_id") REFERENCES "user_otp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_role_id"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_otp_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_shipping_address_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_billing_address_id"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
