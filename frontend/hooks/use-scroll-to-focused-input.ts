import { useCallback, useRef } from 'react';
import type { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { ScrollView } from 'react-native';

export function useScrollToFocusedInput(additionalOffset = 96) {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToFocusedInput = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      const target = event.target;

      requestAnimationFrame(() => {
        if (!target) {
          return;
        }

        scrollViewRef.current?.scrollResponderScrollNativeHandleToKeyboard(
          target,
          additionalOffset,
          true,
        );
      });
    },
    [additionalOffset],
  );

  return {
    scrollViewRef,
    scrollToFocusedInput,
  };
}
