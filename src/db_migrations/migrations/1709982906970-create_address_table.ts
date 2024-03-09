import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddressTable1709982906970 implements MigrationInterface {
  name = 'CreateAddressTable1709982906970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."address_type_enum" AS ENUM('user_shipping', 'user_billing', 'order_shipping', 'order_billing')`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "address_1" character varying NOT NULL, "address_2" character varying, "city" character varying NOT NULL, "pincode" character varying NOT NULL, "state" character varying NOT NULL, "type" "public"."address_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TYPE "public"."address_type_enum"`);
  }
}
