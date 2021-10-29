// In order to make this work with as many things as possible, we gotta do this the old fashioned
// way with real JavaScript

const glob = require('glob');
const { writeFile } = require('fs/promises');
const { join, resolve } = require('path');
const yargs = require('yargs');

const DEFAULT_API_PATH = join('.', 'src', 'pages', 'api');
const DEFAULT_BASE_PATH = join('.', 'openapi-base.json');
const DEFAULT_SAVE_PATH = join('.', 'openapi.json');

const args = yargs
  .scriptName('generate-openapi')
  .option('base', {
    alias: 'b',
    type: 'string',
    description: `Set the path of your base OpenAPI spec containing info, components, .etc (defaults to ${DEFAULT_BASE_PATH})`,
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: `Set the path of your finished OpenAPI spec (defaults to ${DEFAULT_SAVE_PATH})`,
  })
  .option('path', {
    alias: 'p',
    type: 'string',
    description: `Set the path of your API routes (defaults to ${DEFAULT_API_PATH})`,
  })
  .parse();

const base = args.base || DEFAULT_BASE_PATH;
const output = args.output || DEFAULT_SAVE_PATH;
const path = args.path || DEFAULT_API_PATH;

const generateOpenApi = async () => {
  console.info(`INFO: Loading Base Schema from ${resolve(base)}`);
  const baseContents = require(base);

  console.info(`INFO: Searching for JSON Specifications in ${resolve(path)}`);
  const filePaths = await new Promise((resolve) => {
    glob(join(path, '**', '*.json'), (err, res) => {
      if (err) {
        throw err;
      }
      resolve(res);
    });
  });

  console.info('INFO: Adding Files to Schema');
  let paths = {};
  filePaths.forEach((file) => {
    const extractedPathName = file.split(path)[1].split('.json')[0];
    paths = { ...paths, [extractedPathName]: require(file) };
  });

  console.info('INFO: Building Final Schema');
  const openAPiSpec = {
    ...baseContents,
    paths,
  };

  console.info(`INFO: Writing Final Schema to ${resolve(output)}`);
  await writeFile(output, JSON.stringify(openAPiSpec, null, 2));

  console.info('INFO: Done');
};

// For some reason we have to invoke a .catch rather than using a try / catch to avoid an
// unhandledpromiserejectionwarning, no idea why
generateOpenApi().catch((err) => {
  console.error('ERROR:', err.message);
});
