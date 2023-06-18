import {Image} from 'react-native-compressor';

export const imageCompress = async (path: any) => {
  const result = await Image.compress(path, {
    compressionMethod: 'auto',
  }).then(res => res);
  return result;
};
