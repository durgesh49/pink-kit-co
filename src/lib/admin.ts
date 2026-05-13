export const ADMIN_UID =
  "91de6666-4506-445f-8928-bae70b964053";

export const isAdmin = (userId?: string) => {
  return userId === ADMIN_UID;
};