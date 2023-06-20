import React from 'react';
import ResizableSticker from '../ResizableSticker';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {ISticker} from '../../shared/models/interface/sticker.interface';

interface IDownloadableImageProps {
  imagePath: string;
  componentRef: React.MutableRefObject<null | any>;
  list: ISticker[];
}

const DownloadableImage = ({
  list,
  componentRef,
  imagePath,
}: IDownloadableImageProps) => {
  return (
    <>
      <View style={styles.downloadableImageContainer} ref={componentRef}>
        <Image
          style={styles.image}
          source={{
            uri: `file://'${imagePath}`,
          }}
        />
        {list.length > 0 ? (
          <View style={styles.stickersContainer}>
            {list.map((item, index) => (
              <ResizableSticker key={index} source={item.path} />
            ))}
          </View>
        ) : null}
      </View>
    </>
  );
};

export default DownloadableImage;

const styles = StyleSheet.create({
  downloadableImageContainer: {
    position: 'absolute',
    height: Dimensions.get('screen').height,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
  stickersContainer: {
    position: 'absolute',
    top: 100,
    left: 100,
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
});
