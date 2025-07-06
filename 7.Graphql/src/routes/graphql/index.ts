import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyInstance } from 'fastify';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  parse,
  validate,
  GraphQLBoolean,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { UUIDType } from './types/uuid.js';
import { ChangeUserInputType, CreateUserInputType, UserType } from './types/User.js';
import { MemberType } from './types/MemberType.js';
import { memberTypeId } from './types/MemberTypeId.js';
import {
  ChangeProfileInputType,
  CreateProfileInputType,
  ProfileType,
} from './types/ProfileType.js';
import { ChangePostInputType, CreatePostInputType, PostType } from './types/PostType.js';
import { initDataLoaders } from './loader/loader.js';
import { GraphqlContext, Profile } from './types.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { UUID } from 'crypto';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_, __, context: GraphqlContext, info) => {
          const resolveInfo = simplifyParsedResolveInfoFragmentWithType(
            parseResolveInfo(info) as ResolveTree,
            new GraphQLList(UserType),
          );
          const users = await context.prisma.user.findMany({
            include: {
              userSubscribedTo: Boolean(resolveInfo.fields['userSubscribedTo']),
              subscribedToUser: Boolean(resolveInfo.fields['subscribedToUser']),
            },
          });
          users.forEach((u) => {
            context.loaders.userById.prime(u.id as UUID, u);
          });
          return users;
        },
      },
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, context: GraphqlContext) => {
          return await context.loaders.userById.load(id);
        },
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (_, __, context: GraphqlContext) => {
          return await context.prisma.post.findMany();
        },
      },
      post: {
        type: PostType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, context: GraphqlContext) => {
          return await context.loaders.postById.load(id);
        },
      },
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async (_, __, context: GraphqlContext) => {
          return await context.prisma.memberType.findMany();
        },
      },
      memberType: {
        type: MemberType,
        args: { id: { type: new GraphQLNonNull(memberTypeId) } },
        resolve: async (_, { id }: { id: string }, context: GraphqlContext) => {
          return await context.loaders.memberTypeById.load(id);
        },
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: async (_, __, context: GraphqlContext) => {
          return await context.prisma.profile.findMany();
        },
      },
      profile: {
        type: ProfileType,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, context: GraphqlContext) => {
          return await context.loaders.profileById.load(id);
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          dto: {
            type: CreateUserInputType,
          },
        },
        async resolve(
          _,
          args: { dto: { name: string; balance: number } },
          { prisma }: FastifyInstance,
        ) {
          return prisma.user.create({ data: args.dto });
        },
      },
      createPost: {
        type: PostType,
        args: { dto: { type: CreatePostInputType } },
        resolve: async (
          _,
          args: { dto: { title: string; content: string; authorId: string } },
          { prisma }: FastifyInstance,
        ) => {
          return await prisma.post.create({ data: args.dto });
        },
      },
      createProfile: {
        type: ProfileType,
        args: { dto: { type: CreateProfileInputType } },
        resolve: async (_, args: { dto: Profile }, { prisma }: FastifyInstance) => {
          return await prisma.profile.create({ data: args.dto });
        },
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          try {
            await prisma.user.delete({ where: { id: id } });
            return true;
          } catch {
            return false;
          }
        },
      },
      deletePost: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          try {
            await prisma.post.delete({ where: { id } });
            return true;
          } catch {
            return false;
          }
        },
      },
      deleteProfile: {
        type: GraphQLBoolean,
        args: { id: { type: new GraphQLNonNull(UUIDType) } },
        resolve: async (_, { id }: { id: string }, { prisma }: FastifyInstance) => {
          try {
            await prisma.profile.delete({ where: { id } });
            return true;
          } catch {
            return false;
          }
        },
      },
      changeUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: ChangeUserInputType },
        },
        resolve: async (
          _,
          args: { id: string; dto: { name: string; balance: number } },
          { prisma }: FastifyInstance,
        ) => {
          const { id, dto } = args;
          return await prisma.user.update({
            where: { id: id },
            data: dto,
          });
        },
      },
      changePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: ChangePostInputType },
        },
        resolve: async (
          _,
          args: { id: string; dto: { title: string; content: string } },
          { prisma }: FastifyInstance,
        ) => {
          const { id, dto } = args;
          return await prisma.post.update({
            where: { id: id },
            data: dto,
          });
        },
      },
      changeProfile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          dto: { type: ChangeProfileInputType },
        },
        resolve: async (
          _,
          args: { id: string; dto: { isMale: boolean; yearOfBirth: number } },
          { prisma }: FastifyInstance,
        ) => {
          const { id, dto } = args;
          return await prisma.profile.update({
            where: { id: id },
            data: dto,
          });
        },
      },

      subscribeTo: {
        type: GraphQLBoolean,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (
          _,
          args: { userId: string; authorId: string },
          { prisma }: FastifyInstance,
        ) => {
          const { userId, authorId } = args;
          try {
            await prisma.subscribersOnAuthors.create({
              data: {
                subscriberId: userId,
                authorId: authorId,
              },
            });
            return true;
          } catch {
            return false;
          }
        },
      },

      unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
          userId: { type: new GraphQLNonNull(UUIDType) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (
          _,
          args: { userId: string; authorId: string },
          { prisma }: FastifyInstance,
        ) => {
          const { userId, authorId } = args;
          try {
            await prisma.subscribersOnAuthors.deleteMany({
              where: {
                subscriberId: userId,
                authorId: authorId,
              },
            });
            return true;
          } catch {
            return false;
          }
        },
      },
    },
  }),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body: { query, variables } }) {
      const document = parse(query);
      const gqlErrors = validate(schema, document, [depthLimit(5)]);

      if (gqlErrors.length) return { data: null, errors: gqlErrors };

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          loaders: initDataLoaders(prisma),
        },
      });
    },
  });
};

export default plugin;
