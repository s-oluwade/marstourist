import {builder} from '../builder';
import {prisma} from '../db';

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    topic: t.exposeString('topic'),
    content: t.exposeString('content'),
    likes: t.exposeStringList('likes'),
    user: t.relation('User'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
    updatedAt: t.expose('updatedAt', {type: 'Date'}),
  }),
});

builder.queryField('posts', (t) =>
  t.prismaField({
    type: ['Post'],
    args: {
      id: t.arg({
        type: 'String',
      }),
    },
    resolve: async (query, root, args, ctx, info) =>
      prisma.post.findMany({...query, where: {id: args.id ?? undefined}}),
  })
);
