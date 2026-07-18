import type { CollectionConfig } from "payload";

import { authenticated, publicAccess } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    defaultColumns: ["alt", "filename", "updatedAt"],
    useAsTitle: "alt",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publicAccess,
    update: authenticated,
  },
  upload: {
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "content",
        width: 1200,
      },
    ],
    mimeTypes: ["image/avif", "image/gif", "image/jpeg", "image/png", "image/webp"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
    },
  ],
};
