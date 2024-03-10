import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemTable1709993535968 implements MigrationInterface {
  name = 'CreateOrderItemTable1709993535968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "display_order_id" character varying, "order_id" integer NOT NULL, "category_id" integer NOT NULL, "item_id" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "total_price" numeric(10,3), "order_item_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_431fe51ac68c873d35b25aa8c8" UNIQUE ("category_id"), CONSTRAINT "REL_f9129a798f2308714d1e3be246" UNIQUE ("item_id"), CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_order_id" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_category_id" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_item_id" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_item_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_id"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);
  }
}
