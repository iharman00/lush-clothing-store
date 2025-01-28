"use server";

import { getCurrentUser } from ".";

// provides data for frontend consumption after striping out the password hash
export const getCurrentClientSideUser = async () => {
  const user = await getCurrentUser();

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
