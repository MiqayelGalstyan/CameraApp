import React, {ReactNode} from 'react';
import ActionSheet from 'react-native-actions-sheet';
import {ViewStyle} from 'react-native';

interface IBottomSheetProps {
  sheetRef: any;
  handleClose?: () => void;
  children: ReactNode;
  containerStyle?: ViewStyle;
}

const BottomSheet = ({
  sheetRef,
  handleClose,
  children,
  containerStyle,
}: IBottomSheetProps): JSX.Element => {
  return (
    <ActionSheet
      containerStyle={containerStyle}
      onClose={handleClose}
      ref={sheetRef}>
      {children}
    </ActionSheet>
  );
};

export default BottomSheet;
