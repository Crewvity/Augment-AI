# Augment AI

## Description

You can augment your AI with extra knowledge from any custom documents and start having conversations with it.

This is an open source project that is in pre-alpha. It was originally intended to help myself write trading bots for [Crewvity.com](https://crewvity.com). However the code can be tweaked to educate the AI with any other documents for you own needs.

- Integrated with [OpenAI](https://openai.com/) using [LangchainJS](https://js.langchain.com/docs/get_started/introduction)
- Tech stack
  - Typescript
  - [Turborepo](https://turbo.build/) monorepo
  - [NestJS](https://nestjs.com/) server
  - [NextJS] (https://nextjs.org/) web app
  - Postgres - VectorDB (Docker)
- Original code based from [langchain-nextjs-template](https://github.com/langchain-ai/langchain-nextjs-template)
- Completely Open Source and looking for contributors.

## Getting Started

1. [Root folder] `docker-compose up -d`

   - Starts up the vector database as a Docker container

1. [Root folder] [Install volta](https://docs.volta.sh/guide/getting-started) and run `volta pin node@18` to use Node version 18
1. [Root folder] `yarn install`
1. [Server folder] `touch .env`
1. [Server folder] Copy all the values from `.env.example` to `.env`

   - Obtain the API key from [OpenAI platform](https://platform.openai.com/) and add it to the env variable `OPENAI_API_KEY`.

1. [Server folder] Add any teaching materials into the `documents` folder. File formats can be `json`, `jsonl`, `txt`, `csv`, and `pdf`.

1. [Server folder] Start the server with `yarn dev`

1. In [LlmService](apps/augment-ai-server/src/llm/service/llm.service.ts), change the CUSTOM_INSTRUCTIONS constant value to give your own custom instructions.

1. [Web folder] `touch .env.local`
1. [Web folder] Copy all the values from `.env.example` to `.env.local`
1. [Web folder] Start the web server with `yarn dev`

1. Open the web app from the browser and enter the absolute path to the [documents](apps/augment-ai-server/documents) folder

## Contributors

- [Join us as a contributor... hello@crewvity.com]

## License

This project is [MIT licensed](LICENSE).
