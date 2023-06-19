import React, {useRef, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import {ScrollView} from 'react-native';
import {stickersData} from '../../shared/constants/data';
import {ISticker} from '../../shared/models/interface/sticker.interface';
import BackIcon from '../../../assets/icons/backIcon.svg';
import BottomSheet from '../../shared/components/BottomSheet';

interface IStickerPickerProps {
  handleSelect: (event: any, item: ISticker) => void;
  bottomSheetRef: any;
  handleClose: () => void;
}

const StickersPicker = ({
  handleSelect,
  handleClose,
  bottomSheetRef,
}: IStickerPickerProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>('');
  const [stickersList, setStickersList] = useState<ISticker[]>(stickersData);

  const textInputRef = useRef<TextInput>(null);

  const handleChange = (text: string) => {
    const updatedData = text
      ? stickersData.filter((item: ISticker) =>
          item.keyword.find(elem =>
            elem?.toLowerCase().startsWith(text?.toLowerCase()),
          ),
        )
      : stickersData;
    setInputValue(text);
    setStickersList(updatedData);
  };

  const closeBottomSheet = () => {
    setStickersList(stickersData);
    setInputValue('');
    handleClose();
    Keyboard.dismiss();
    textInputRef.current?.blur();
  };

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      style={styles.keyboardAvoidingStyle}>
      <BottomSheet
        containerStyle={styles.bottomSheetStyle}
        sheetRef={bottomSheetRef}
        handleClose={closeBottomSheet}>
        <View style={styles.textFieldArea}>
          <TouchableOpacity
            onPress={closeBottomSheet}
            style={styles.closeSheetBtn}>
            <BackIcon width={14} height={14} fill="white" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search GIPHY..."
            value={inputValue}
            onChangeText={handleChange}
            style={styles.textInput}
            ref={textInputRef}
          />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.scrollViewContainer}>
          {stickersList.length > 0 ? (
            stickersList.map((item: ISticker) => (
              <TouchableOpacity
                key={item.id}
                style={styles.stickerItem}
                onPress={(event: any) => handleSelect(event, item)}>
                <Image
                  style={styles.imgStyle}
                  source={item.path}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundText}>Not Found</Text>
            </View>
          )}
        </ScrollView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

export default StickersPicker;

const styles = StyleSheet.create({
  keyboardAvoidingStyle: {
    flex: 1,
    height:
      Platform.OS === 'android'
        ? Dimensions.get('window').height -
          (StatusBar.currentHeight ? StatusBar.currentHeight : 0)
        : Dimensions.get('window').height,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexGrow: 1,
  },
  stickerItem: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    height: 150,
    marginBottom: 30,
  },
  closeSheetBtn: {
    marginLeft: 10,
    marginTop: 15,
    marginRight: 10,
    width: 14,
  },
  bottomSheetStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 50,
    paddingHorizontal: 10,
    height: Dimensions.get('screen').height,
    width: '100%',
  },
  textFieldArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    width: '100%',
    marginTop: 10,
    paddingBottom: 15,
  },
  imgStyle: {
    width: '100%',
    height: '100%',
  },
  notFoundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    flex: 1,
  },
  notFoundText: {
    color: 'white',
    fontSize: 15,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    color: 'white',
    paddingLeft: 10,
    flex: 1,
  },
});
