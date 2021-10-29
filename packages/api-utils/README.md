# NextJS API Utilities

> Tooling to build better, more secure APIs with Next.js

## Installation

```bash
yarn add @kienleholdings/nextjs-api-utils
```

## Usage

### Generating OpenAPI Specifications

Any good API needs good documentation, but maintaining one giant OpenAPI specification can be a
real nightmare for backend developers, especially when mege conflicts are involved. Luckily, this
package contains an easy utility that turns json files that live alongside your API endpoints into
OpenAPI (or Swagger) specifications! Here's how to do it:

1. In the root of your API's package, create a new file called `openapi-base.json`
1. Populate that file with your OpenAPI spec's `info`, `components`, .etc
1. In the same directory as your API endpoint, create a `.json` file. As an example, if my endpoint
was `/api/users` and contained a file named `users.js`, I'd create a file named `users.json`
1. In your newly-created file, populate it with OpenAPI definitions for each exposed method
1. Once you've documented all of your API endpoints, run `yarn run generate-openapi-spec`

Need your files named something different? Need to pull json definitions from a different
directory? Run `generate-openapi-slec --help` for full command info

Not sure how to write OpenAPI definitions? The [Swagger Editor](https://editor.swagger.io/) and
[PetStore](https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.yaml)
example are both great places to get started

## Local Development

1. Clone the repo
1. [Open the folder as a container](https://code.visualstudio.com/docs/remote/containers)
with VSCode
1. Wait for dependencies to install
1. Run `yarn build`
1. Note the output in `./lib`
