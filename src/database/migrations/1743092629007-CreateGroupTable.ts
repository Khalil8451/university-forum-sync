import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupTable1743092629007 implements MigrationInterface {
  name = 'CreateGroupTable1743092629007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8a45300fd825918f3b40195fbdc" UNIQUE ("name"), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8a45300fd825918f3b40195fbd" ON "group" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_instructor_groups_group" ("userId" integer NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_760e7d064eb1a94db51b57440e1" PRIMARY KEY ("userId", "groupId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a583b83b686cc82f4fbaa0ee8" ON "user_instructor_groups_group" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5308938f21cb4350ebbbee3265" ON "user_instructor_groups_group" ("groupId") `,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "groupId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_974590e8d8d4ceb64e30c38e051" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_instructor_groups_group" ADD CONSTRAINT "FK_4a583b83b686cc82f4fbaa0ee86" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_instructor_groups_group" ADD CONSTRAINT "FK_5308938f21cb4350ebbbee3265a" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_instructor_groups_group" DROP CONSTRAINT "FK_5308938f21cb4350ebbbee3265a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_instructor_groups_group" DROP CONSTRAINT "FK_4a583b83b686cc82f4fbaa0ee86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_974590e8d8d4ceb64e30c38e051"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "groupId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5308938f21cb4350ebbbee3265"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a583b83b686cc82f4fbaa0ee8"`,
    );
    await queryRunner.query(`DROP TABLE "user_instructor_groups_group"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a45300fd825918f3b40195fbd"`,
    );
    await queryRunner.query(`DROP TABLE "group"`);
  }
}
