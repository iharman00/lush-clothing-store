"use server";

import { getCurrentUser } from ".";

// provides data for frontend consumption after striping out the password hash
export const getCurrentClientSideUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
