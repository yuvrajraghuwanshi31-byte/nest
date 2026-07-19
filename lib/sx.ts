import { StyleSheet } from 'react-native';

/** Flatten RN style arrays into one object (avoids RN Web CSSStyleDeclaration crashes). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sx(...styles: any[]): any {
  return StyleSheet.flatten(styles);
}
