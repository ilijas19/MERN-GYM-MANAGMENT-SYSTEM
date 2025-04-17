const checkFile = (file) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/ico",
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return false;
  }
  if (file.size > 2097152) {
    return false;
  }
  return true;
};
export default checkFile;
