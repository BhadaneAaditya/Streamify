import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

// Get the currently authenticated user's database record
export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Get user by username but ensure it matches the current logged-in user
export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();

  if (!self || !self.id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new Error(`User not found for username: ${username}`);
  }

  if (self.id !== user.externalUserId) {
    throw new Error("Unauthorized");
  }

  return user;
};
