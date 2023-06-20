import React, {useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import StickersPicker from '../StickersPicker';
import Loader from '../../shared/components/Loader';
import {ISticker} from '../../shared/models/interface/sticker.interface';
import TextSVGIcon from '../../../assets/icons/textIcon.svg';
import StickerSVGIcon from '../../../assets/icons/stickerIcon.svg';
import CloseIcon from '../../../assets/icons/close.svg';
import DownloadableImage from '../DownloadableImage';

interface IImageEditorProps {
  loading: boolean;
  imagePath: string;
  componentRef: React.MutableRefObject<null | any>;
  sheetRef: React.MutableRefObject<null | any>;
  handleShowCamera: () => void;
  saveBtnHandler: () => Promise<void>;
}

const ImageEditor = ({
  loading,
  imagePath,
  componentRef,
  sheetRef,
  handleShowCamera,
  saveBtnHandler,
}: IImageEditorProps): JSX.Element => {
  const [selectedItemsList, setSelectedItemsList] = useState<ISticker[]>([]);

  const handleSelect = (event: any, item: ISticker) => {
    setSelectedItemsList([...selectedItemsList, item]);
    Keyboard.dismiss();
    handleClose();
  };

  const handleOpen = (): void => {
    sheetRef.current?.show();
  };

  const handleClose = (): void => {
    sheetRef?.current?.hide();
  };

  return (
    <>
      {!loading && imagePath ? (
        <>
          <DownloadableImage
            list={selectedItemsList}
            componentRef={componentRef}
            imagePath={imagePath}
          />
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
            bottomSheetRef={sheetRef as any}
          />
          <View style={styles.imageEditingButtons}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => console.log('text icon')}>
              <TextSVGIcon width={40} height={40} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={handleOpen}>
              <StickerSVGIcon width={40} height={40} />
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

export default ImageEditor;

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
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
});
