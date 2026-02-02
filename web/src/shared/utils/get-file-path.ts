// * Make the avatar image path ready to be user
export const getFilePath = (fileUrl: string) => {
  if (!fileUrl) fileUrl = "/default";
  return fileUrl.startsWith("http") || fileUrl.startsWith("https")
    ? fileUrl
    : `${import.meta.env.VITE_API_UPLOAD_URL}/${fileUrl}`;
};
