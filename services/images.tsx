import * as FileSystem from "expo-file-system";
import mime from "mime";

export const processUri = async (uri: string) => {
  if (uri.startsWith("file://")) {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      return uri;
    } else {
      console.log("File does not exist at the specified URI.");
    }
  }
  return uri;
};

export const getMimeType = async (uri: string) => {
  let mimeType = mime.getType(uri) || 'image/jpeg';
  let ext = mime.getExtension(mimeType);

  return {
    'mimeType': mimeType,
    'ext': ext
  }
};