"use server";

import { unstable_cache as cache } from "next/cache";
import { prisma } from "../prisma";

export const getMyProfile = cache(
  async (email: string | null | undefined) => {
    try {
      if (!email) return null;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) return null;
      return user;
    } catch (error) {
      return null;
    }
  },
  [],
  { revalidate: 60 * 60 * 24 }
);
