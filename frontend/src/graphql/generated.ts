import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Cart = {
  __typename?: 'Cart';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  items: Array<CartItem>;
  updatedAt: Scalars['Date']['output'];
  user: User;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type CartItem = {
  __typename?: 'CartItem';
  cart: Cart;
  id: Scalars['ID']['output'];
  product: Product;
  productId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['ID']['output'];
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  likes: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  topic: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user: User;
};

export type Product = {
  __typename?: 'Product';
  brand: Scalars['ID']['output'];
  category: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  description: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['ID']['output'];
  name: Scalars['ID']['output'];
  price: Scalars['ID']['output'];
  updatedAt: Scalars['Date']['output'];
};

/** The query root type. */
export type Query = {
  __typename?: 'Query';
  cart: Cart;
  posts: Array<Post>;
  products: Array<Product>;
  user: User;
  users: Array<User>;
};


/** The query root type. */
export type QueryCartArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


/** The query root type. */
export type QueryPostsArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


/** The query root type. */
export type QueryProductsArgs = {
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


/** The query root type. */
export type QueryUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  cart: Array<Cart>;
  createdAt: Scalars['Date']['output'];
  credit: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  friends: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  posts: Array<Post>;
  updatedAt: Scalars['Date']['output'];
  username: Scalars['String']['output'];
};

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', name: string, description: string, category: string, brand: string, imageUrl: string, price: string, createdAt: any, updatedAt: any }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', name: string }> };


export const GetProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProducts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetProductsQuery, GetProductsQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;