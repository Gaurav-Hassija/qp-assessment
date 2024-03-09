import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTable1709992965491 implements MigrationInterface {
  name = 'CreateOrderTable1709992965491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "display_order_id" character varying, "user_id" integer NOT NULL, "order_amount" numeric(10,2) NOT NULL, "order_cgst" numeric(10,3), "order_sgst" numeric(10,3), "order_igst" numeric(10,3), "grand_total" numeric(10,3) NOT NULL, "order_status" character varying NOT NULL, "billing_address_id" integer NOT NULL, "shipping_address_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_5568d3b9ce9f7abeeb37511ecf" UNIQUE ("billing_address_id"), CONSTRAINT "REL_19b0c6293443d1b464f604c331" UNIQUE ("shipping_address_id"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_billing_address_id" FOREIGN KEY ("billing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_shipping_address_id" FOREIGN KEY ("shipping_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_shipping_address_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_billing_address_id"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_user_id"`);
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
