import type { CollectionConfig } from "payload";

import { authenticated, authenticatedAdmin } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    admin: authenticatedAdmin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
