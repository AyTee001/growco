import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderFields1775751476113 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL`,);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_slot_id" DROP NOT NULL`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customer_name" character varying(255)`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customer_phone" character varying(50)`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "comment" text`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "is_paperless" boolean NOT NULL DEFAULT false`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_slot_start" TIME`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_slot_end" TIME`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_address" character varying(500)`,);
        await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_date"`,);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_address"`,);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_slot_end"`);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_slot_start"`);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "is_paperless"`);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "comment"`);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_phone"`);
      await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer_name"`);
      await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "delivery_slot_id" SET NOT NULL`,);
      await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "user_id" SET NOT NULL`);
    }

}
