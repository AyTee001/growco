import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandProductEntity1774787358877 implements MigrationInterface {
    name = 'ExpandProductEntity1774787358877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "brand" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "origin_country" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "is_promo" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "products" ADD "old_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "net_content" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "products" ADD "unit" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "CartItems" ALTER COLUMN "quantity" SET DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "qty_in_stock" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "qty_in_stock" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "CartItems" ALTER COLUMN "quantity" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "net_content"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "old_price"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_promo"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "origin_country"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brand"`);
    }

}
