import { useColorMode } from '@chakra-ui/core';
import { COLOR_MODE_DARK } from 'constants/colorMode';

const useIsDarkMode = () => {
  const { colorMode } = useColorMode();
  return colorMode === COLOR_MODE_DARK;
};

export default useIsDarkMode;
