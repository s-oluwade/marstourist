import {builder} from '../builder';
import {prisma} from '../db';

builder.prismaObject('Product', {
fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeID('name'),
    description: t.exposeID('description'),
    category: t.exposeID('category'),
    brand: t.exposeID('brand'),
    imageUrl: t.exposeID('imageUrl'),
    price: t.exposeID('price'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
    updatedAt: t.expose('updatedAt', {type: 'Date'}),
  }),
});

builder.queryField('products', (t) =>
  t.prismaField({
    type: ['Product'],
    args: {
      id: t.arg({
        type: 'String',
      }),
      name: t.arg({
        type: 'String',
      }),
      category: t.arg({
        type: 'String',
      }),
      brand: t.arg({
        type: 'String',
      }),
    },
    resolve: async (query, root, args, ctx, info) =>
      prisma.product.findMany({
        ...query,
        where: {
          id: args.id ?? undefined,
          name: args.name ?? undefined,
          category: args.category ?? undefined,
          brand: args.brand ?? undefined,
        },
      }),
  })
);
