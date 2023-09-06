// pothos helps us build our graphql schema
// based on our prisma schema configuration

import SchemaBuilder from '@pothos/core';
import {DateResolver} from 'graphql-scalars';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import {prisma} from './db';

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: {Input: Date; Output: Date};
  };

  PrismaTypes: PrismaTypes;
  Context: {id: string};
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType({
  description: 'The query root type.',
});

builder.addScalarType('Date', DateResolver, {});
