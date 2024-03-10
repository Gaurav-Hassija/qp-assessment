import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateItemTableAddUnitColumn1710080557907
  implements MigrationInterface
{
  name = 'UpdateItemTableAddUnitColumn1710080557907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" ADD "unit" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "stock_inventory"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "stock_inventory" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "stock_inventory"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "stock_inventory" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "unit"`);
  }
}
