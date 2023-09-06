import {builder} from '../builder';
import {prisma} from '../db';

builder.prismaObject('Cart', {
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeID('userId', {nullable: true}),
    user: t.relation('user'),
    items: t.relation('items'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
    updatedAt: t.expose('updatedAt', {type: 'Date'}),
  }),
});

builder.queryField('cart', (t) =>
  t.prismaField({
    type: 'Cart',
    args: {
      id: t.arg({
        type: 'String',
      }),
    },
    resolve: async (query, root, args, ctx, info) =>
      prisma.cart.findUniqueOrThrow({...query, where: {id: args.id ?? undefined}}),
  })
);
