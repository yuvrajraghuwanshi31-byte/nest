import { useWindowDimensions } from 'react-native';

import { layout } from '@/constants/theme';

export function useWideLayout() {
  const { width } = useWindowDimensions();
  return width >= layout.breakpoint;
}
