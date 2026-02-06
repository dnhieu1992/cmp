import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionTable1770384386133 implements MigrationInterface {
  name = 'CreatePermissionTable1770384386133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`code\` varchar(120) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_30e166e8c6359970755c5727a2\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`roleId\` int NULL, \`permissionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`is_deleted\` tinyint NOT NULL DEFAULT 0, \`session_token\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`ip_address\` varchar(120) NULL, \`user_agent\` varchar(255) NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_e4121ac23e4887f7354d81e15b\` (\`session_token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_b4599f8b8f548d35850afa2d12c\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` ADD CONSTRAINT \`FK_06792d0c62ce6b0203c03643cdd\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_3d2f174ef04fb312fdebd0ddc53\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_3d2f174ef04fb312fdebd0ddc53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_06792d0c62ce6b0203c03643cdd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permissions\` DROP FOREIGN KEY \`FK_b4599f8b8f548d35850afa2d12c\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e4121ac23e4887f7354d81e15b\` ON \`session\``,
    );
    await queryRunner.query(`DROP TABLE \`session\``);
    await queryRunner.query(`DROP TABLE \`role_permissions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_30e166e8c6359970755c5727a2\` ON \`permission\``,
    );
    await queryRunner.query(`DROP TABLE \`permission\``);
  }
}
