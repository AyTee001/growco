import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1776084491947 implements MigrationInterface {
    name = 'Products1776084491947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "qty_in_stock" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "CartItems" ALTER COLUMN "quantity" SET DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CartItems" ALTER COLUMN "quantity" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "qty_in_stock" SET DEFAULT '0'`);
    }

}
