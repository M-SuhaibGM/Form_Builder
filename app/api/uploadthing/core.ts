import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl, name: file.name };
  }),

  documentUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 3 },
    text: { maxFileSize: "2MB", maxFileCount: 3 },
    "application/msword": { maxFileSize: "8MB", maxFileCount: 3 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "8MB",
      maxFileCount: 3,
    },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl, name: file.name };
  }),

  anyUploader: f({
    blob: { maxFileSize: "8MB", maxFileCount: 3 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.ufsUrl, name: file.name };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;