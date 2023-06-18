import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  RotationGestureHandler,
  GestureEventPayload,
  PinchGestureHandlerEventPayload,
  RotationGestureHandlerEventPayload,
  RotationGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withDecay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface IResizableProps {
  source: any;
}

const increasedRotationSpeed: number = 80;

const ResizableSticker: React.FC<IResizableProps> = ({source}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const onPanGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {startX: number; startY: number}
  >({
    onStart: (event, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: event => {
      translateX.value = withDecay({velocity: event.velocityX});
      translateY.value = withDecay({velocity: event.velocityY});
    },
  });

  const onPinchGestureEvent = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startScale: number}
  >({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (
      event: Readonly<GestureEventPayload & PinchGestureHandlerEventPayload>,
      ctx,
    ) => {
      scale.value = ctx.startScale * event.scale;
    },
    onEnd: () => {},
  });

  const onRotateGestureEvent = useAnimatedGestureHandler<
    RotationGestureHandlerGestureEvent,
    {startRotate: number}
  >({
    onStart: (_, ctx) => {
      ctx.startRotate = rotate.value;
    },
    onActive: (
      event: Readonly<GestureEventPayload & RotationGestureHandlerEventPayload>,
      ctx,
    ) => {
      const degree = event.rotation * increasedRotationSpeed;
      rotate.value = withTiming(ctx.startRotate + degree, {
        duration: 0,
        easing: Easing.linear,
      });
    },
    onEnd: () => {},
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {rotate: `${rotate.value}deg`},
        {scale: scale.value},
      ],
    } as never;
  });

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <Animated.View style={[styles.stickerContainer, animatedStyle]}>
            <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
              <Animated.View>
                <RotationGestureHandler
                  onGestureEvent={onRotateGestureEvent}
                  simultaneousHandlers={['pinchGesture'] as never}>
                  <Animated.View>
                    <Image source={source} style={styles.sticker} />
                  </Animated.View>
                </RotationGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickerContainer: {
    position: 'absolute',
  },
  sticker: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    bottom: 150,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    flex: 1,
    zIndex: 3,
  },
});

export default ResizableSticker;
