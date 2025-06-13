#!/bin/sh

npm run prisma:deploy

npm run prisma:generate

npm run start:dev