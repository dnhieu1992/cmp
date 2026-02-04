const { spawnSync } = require('node:child_process');

const argv = process.argv.slice(2);
const nameArg =
  argv.find((arg) => arg.startsWith('--name=')) ||
  argv[argv.indexOf('--name') + 1];
const name =
  (nameArg && nameArg.replace(/^--name=/, '')) ||
  process.env.npm_config_name ||
  process.env.PNPM_CONFIG_NAME;

if (!name) {
  console.error(
    'Missing --name. Example: pnpm --filter api run migration:generate -- --name=create-users',
  );
  process.exit(1);
}

const args = [
  '-d',
  'src/database/data-source.ts',
  'migration:generate',
  `src/database/migrations/${name}`,
];

const result = spawnSync('typeorm-ts-node-commonjs', args, {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
