import { PrismaClient } from '@prisma/client';
import { UUID } from 'crypto';
import DataLoader from 'dataloader';

export const initDataLoaders = (prisma: PrismaClient) => {
  const profileById = new DataLoader(async (profileIds) => {
    const profileList = await prisma.profile.findMany({
      where: { id: { in: [...profileIds] as string[] } },
    });
    profileList.forEach((profile) => {
      profileByUserId.prime(profile.userId as UUID, profile);
    });
    return profileIds.map((id) => profileList.find((profile) => profile.id === id));
  });

  const profileByUserId = new DataLoader(async (profileUserIds) => {
    const profileList = await prisma.profile.findMany({
      where: { userId: { in: [...profileUserIds] as string[] } },
    });
    profileList.forEach((profile) => {
      profileById.prime(profile.id as UUID, profile);
    });
    return profileUserIds.map((id) =>
      profileList.find((profile) => profile.userId === id),
    );
  });

  return {
    userById: new DataLoader(async (userIds) => {
      const userList = await prisma.user.findMany({
        where: { id: { in: [...userIds] as string[] } },
        include: {
          userSubscribedTo: true,
          subscribedToUser: true,
        },
      });

      return userIds.map((id) => userList.find((user) => user.id === id));
    }),

    postById: new DataLoader(async (postIds) => {
      const postList = await prisma.post.findMany({
        where: { id: { in: [...postIds] as string[] } },
      });

      return postIds.map((id) => postList.find((post) => post.id === id));
    }),

    memberTypeById: new DataLoader(async (memberTypeIds) => {
      const memberTypeList = await prisma.memberType.findMany({
        where: { id: { in: [...memberTypeIds] as string[] } },
      });
      return memberTypeIds.map((id) =>
        memberTypeList.find((memberType) => memberType.id === id),
      );
    }),

    postsByAuthorId: new DataLoader(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: authorIds as string[] } },
      });

      return authorIds.map((authorId) =>
        posts.filter((post) => post.authorId === authorId),
      );
    }),

    profileByUserId: profileByUserId,
    profileById: profileById,
  };
};
