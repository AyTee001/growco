import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoordinates1776016335999 implements MigrationInterface {
    name = 'AddCoordinates1776016335999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Stores" ADD "lat" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "Stores" ADD "lng" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "Orders" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "qty_in_stock" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "CartItems" ALTER COLUMN "quantity" SET DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CartItems" ALTER COLUMN "quantity" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "qty_in_stock" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "Orders" ALTER COLUMN "status" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Stores" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "Stores" DROP COLUMN "lat"`);
    }

}
