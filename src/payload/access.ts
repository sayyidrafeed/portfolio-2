import type { Access, PayloadRequest } from "payload";

function hasAuthenticatedUser(req: PayloadRequest) {
  return Boolean(req.user);
}

export const authenticated: Access = ({ req }) => hasAuthenticatedUser(req);
export function authenticatedAdmin({ req }: { req: PayloadRequest }) {
  return hasAuthenticatedUser(req);
}
export const publicAccess: Access = () => true;
