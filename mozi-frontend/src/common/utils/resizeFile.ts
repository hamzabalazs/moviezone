import Resizer from "react-image-file-resizer";

export const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      640,
      480,
      "JPEG",
      60,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });