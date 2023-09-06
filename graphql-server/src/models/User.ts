import {builder} from '../builder';
import {prisma} from '../db';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    username: t.exposeString('username'),
    email: t.exposeString('email'),
    password: t.exposeString('password'),
    credit: t.exposeInt('credit'),
    avatarUrl: t.exposeString('avatar_url', {nullable: true}),
    bio: t.exposeString('bio', {nullable: true}),
    location: t.exposeString('location', {nullable: true}),
    friends: t.exposeStringList('friends'),
    posts: t.relation('posts'),
    cart: t.relation('Cart'),
    createdAt: t.expose('createdAt', {type: 'Date'}),
    updatedAt: t.expose('updatedAt', {type: 'Date'}),
  }),
});

builder.queryField('users', (t) =>
  t.prismaField({
    type: ['User'],
    resolve: async (query, root, args, ctx, info) => prisma.user.findMany({...query}),
  })
);

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    args: {
      id: t.arg({
        type: 'String',
      }),
    },
    resolve: async (query, root, args, ctx, info) => prisma.user.findUniqueOrThrow({...query, where: {id: args.id ?? undefined}}),
  })
);
