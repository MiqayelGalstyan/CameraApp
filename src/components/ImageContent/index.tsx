import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ResizableSticker from '../ResizableSticker';
import StickersPicker from '../StickersPicker';
import Loader from '../../shared/components/Loader';
import {ISticker} from '../../shared/models/interface/sticker.interface';
import TextIcon from '../../../assets/icons/textIcon.jpg';
import StickerIcon from '../../../assets/icons/stickerIcon.jpg';
import CloseIcon from '../../../assets/icons/close.svg';

interface IImageContentProps {
  loading: boolean;
  imagePath: string;
  componentRef: React.MutableRefObject<null | any>;
  selectedItemsList: ISticker[];
  handleSelect: (event: any, item: ISticker) => void;
  bottomSheetRef: any;
  handleClose: () => void;
  handleOpen: () => void;
  handleShowCamera: () => void;
  saveBtnHandler: () => Promise<void>;
}

const ImageContent = ({
  loading,
  imagePath,
  componentRef,
  selectedItemsList,
  handleClose,
  handleSelect,
  bottomSheetRef,
  handleOpen,
  handleShowCamera,
  saveBtnHandler,
}: IImageContentProps): JSX.Element => {
  return (
    <>
      {!loading && imagePath ? (
        <>
          <View style={styles.downloadableImageContainer} ref={componentRef}>
            <Image
              style={styles.image}
              source={{
                uri: `file://'${imagePath}`,
              }}
            />
            {selectedItemsList.length > 0 ? (
              <View style={styles.stickersContainer}>
                {selectedItemsList.map((item, index) => (
                  <ResizableSticker key={index} source={item.path} />
                ))}
              </View>
            ) : null}
          </View>
          <View style={styles.backButton}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleShowCamera}>
              <CloseIcon height={40} color="white" width={40} />
            </TouchableOpacity>
          </View>
          <StickersPicker
            handleSelect={handleSelect}
            handleClose={handleClose}
            bottomSheetRef={bottomSheetRef as any}
          />
          <View style={styles.imageEditingButtons}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => console.log('text icon')}>
              <Image
                source={TextIcon}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={handleOpen}>
              <Image
                source={StickerIcon}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {selectedItemsList.length > 0 ? (
            <TouchableOpacity style={styles.saveBtn} onPress={saveBtnHandler}>
              <Text>Save in the gallery</Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ImageContent;

const styles = StyleSheet.create({
  saveBtn: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 46,
    width: '85%',
    zIndex: 2,
  },
  saveBtnText: {
    color: '#202020',
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    width: 40,
    height: 40,
    zIndex: 3,
  },
  closeBtn: {
    padding: 10,
    width: 100,
    marginTop: 50,
  },
  imageEditingButtons: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    transform: [{translateY: 0}],
    padding: 20,
  },
  stickersContainer: {
    position: 'absolute',
    top: 100,
    left: 100,
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
  downloadableImageContainer: {
    position: 'absolute',
    flex: 1,
  },
});
