import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import {ScrollView} from 'react-native';
import {stickersData} from '../../shared/constants/data';
import {ISticker} from '../../shared/models/interface/sticker.interface';
import BackIcon from '../../../assets/icons/backIcon.svg';
import BottomSheet from '../../shared/components/BottomSheet';

interface IStickerPickerProps {
  handleSelect: (item: ISticker) => void;
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

  const handleChange = (text: string) => {
    const updatedData = text
      ? stickersData.filter((item: ISticker) =>
          item.keyword.find(elem => elem.startsWith(text)),
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
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView>
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
            />
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {stickersList.length > 0 ? (
              stickersList.map((item: ISticker) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.stickerItem}
                    onPress={() => handleSelect(item)}>
                    <Image
                      style={styles.imgStyle}
                      source={item.path}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Not Found</Text>
              </View>
            )}
          </ScrollView>
        </BottomSheet>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default StickersPicker;

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    flexGrow: 1,
  },
  stickerItem: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    height: 100,
    marginBottom: 85,
  },
  closeSheetBtn: {
    marginLeft: 10,
    marginTop: 15,
    marginRight: 10,
    width: 14,
  },
  bottomSheetStyle: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    marginBottom: 50,
    paddingHorizontal: 10,
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
