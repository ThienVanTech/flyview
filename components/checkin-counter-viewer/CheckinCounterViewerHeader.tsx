import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Clock } from '../Clock';

interface CheckinCounterViewerHeaderProps {
  airlineName: string | undefined;
  logo: string | undefined;
  headerColor: string | undefined;
  textColor: string | undefined;
}

export const CheckinCounterViewerHeader = ({ airlineName, logo, headerColor, textColor }: CheckinCounterViewerHeaderProps) => {
  return (
    <Box w="full" bg={headerColor} px="8" py="4">
      <Flex justifyContent="space-between" alignItems="center" gap="8" w="full">
        <Box w="20%">
          <Image alt={airlineName} src={logo} h={{ base: '12px', sm: '14px', md: '24px', lg: '40px', xl: '60px' }} />
        </Box>
        <Text textStyle="viewerHeaderTitle" color={textColor} lineHeight="1" w="60%" textAlign="center">
          Check-in Counter
        </Text>
        <Clock textColor={textColor} textStyle="viewerHeader" />
      </Flex>
    </Box>
  );
};
