import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface BoardingViewerHeaderProps {
  airlineName: string;
  logo: string;
  headerColor: string;
  textColor: string;
}

export const BoardingViewerHeader = ({ airlineName, logo, headerColor, textColor }: BoardingViewerHeaderProps) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="full" bg={headerColor} h="120px">
      <Flex h="full" alignItems="center" justifyContent="space-between" px="8">
        <Image src={logo} alt={airlineName} h="80px" objectFit="contain" />
        <Text textStyle="viewerHeaderTitle" color={textColor}>
          Boarding Information
        </Text>
        <Text textStyle="viewerHeaderTime" color={textColor}>
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </Text>
      </Flex>
    </Box>
  );
};
