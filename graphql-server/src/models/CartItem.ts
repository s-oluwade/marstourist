import {builder} from '../builder';
import {prisma} from '../db';

builder.prismaObject('CartItem', {
    fields: (t) => ({
        id: t.exposeID('id'),
        productId: t.exposeID('productId', {nullable: true}),
        product: t.relation('product'),
        quantity: t.exposeID('quantity'),
        cart: t.relation('cart')
    })
})
