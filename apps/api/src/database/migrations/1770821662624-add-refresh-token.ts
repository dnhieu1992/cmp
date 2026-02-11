import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1770821662624 implements MigrationInterface {
  name = 'AddRefreshToken1770821662624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`refresh_token_hash\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`refresh_token_hash\``,
    );
  }
}
