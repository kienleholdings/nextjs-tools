# NextJS API Utilities

> Tooling to build better, more secure APIs with Next.js

## Installation

```bash
yarn add @kienleholdings/nextjs-api-utils
```

## Usage

This package exposes several modules and scripts, the following documentation should cover most use
cases

### Building API Handlers

```typescript
import { createHandler } from '@kienleholdings/nextjs-api-utils';

// Available methods include get, post, patch, put, and delete
const handler = createHandler({
  get: (req, res) => {
    // TODO: Write handler
  },
});

export default handler;
```

### Using Standardized Responses

```typescript
import { apiResponse } from '@kienleholdings/nextjs-api-utils';

...

const get = (req, res) => {
  // Sends a 200 response with a JSON body { "data": "foo" }
  apiResponse.ok(res, { data: 'foo' });
};

...

```

### Using Standardized Middleware Stack

This includes a body parser, body validator, and CORS middleware (unconfigured by default)

```typescript
import { withMiddleware } from '@kienleholdings/nextjs-api-utils';

...

export default withMiddleware()()(handler);

```

### Configuring Middleware

#### Body Parser

```typescript
import { withMiddleware } from '@kienleholdings/nextjs-api-utils';

...

export default withMiddleware({
  bodyParserConfig: ['application/json'] // Only allow application/json to be submitted,
})()(handler);

```

#### Body Validator

```typescript
import { withMiddleware } from '@kienleholdings/nextjs-api-utils';
import * as yup from 'yup';

const postSchema = Yup.object().shape({
  foo: Yup.string().required(),
  bar: Yup.bool().required()
});

...

// This enforces that `foo` is a required string and `bar` is a required boolean. The API will
// return a 422 (unprocessable entity) if the schema is not satisfied
export default withMiddleware({
  bodyValidatorConfig: {
    post: postSchema
  }
})()(handler);

```

#### CORS

```typescript
import { withMiddleware } from '@kienleholdings/nextjs-api-utils';

...

// See https://www.npmjs.com/package/cors for more complete configuration options
export default withMiddleware({
  corsConfig: {
    origin: 'http://example.com',
  }
})()(handler);

```

### Generating OpenAPI Specifications

Any good API needs good documentation, but maintaining one giant OpenAPI specification can be a
Any good API needs good documentation, but maintaining one giant OpenAPI specification can be a real
nightmare for backend developers, especially when mege conflicts are involved. Luckily, this package
contains an easy utility that turns json files that live alongside your API endpoints into OpenAPI
(or Swagger) specifications! Here's how to do it:

1. In the root of your API's package, create a new file called `openapi-base.json`
1. Populate that file with your OpenAPI spec's `info`, `components`, .etc
1. In the same directory as your API endpoint, create a `.json` file. As an example, if my endpoint
   was `/api/users` and contained a file named `users.js`, I'd create a file named `users.json`
1. In your newly-created file, populate it with OpenAPI definitions for each exposed method
1. Once you've documented all of your API endpoints, run `yarn run generate-openapi-spec`

Need your files named something different? Need to pull json definitions from a different directory?
Run `generate-openapi-slec --help` for full command info

Not sure how to write OpenAPI definitions? The [Swagger Editor](https://editor.swagger.io/) and
[PetStore](https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.yaml)
example are both great places to get started

## Local Development

1. Clone the repo
1. [Open the folder as a container](https://code.visualstudio.com/docs/remote/containers) with
   VSCode
1. Wait for dependencies to install
1. Run `yarn build`
1. Note the output in `./lib`
