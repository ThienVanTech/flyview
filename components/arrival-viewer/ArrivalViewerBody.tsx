import { IFirestoreFlightDocument } from '@/hooks/useFlights';
import { MINUTES_AFTER_DEP_TO_DISPLAY, viewerWidths } from '@/pages/viewer';
import { formatTime } from '@/utils/dateUtils';
import { Box, Flex, keyframes, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface ArrivalViewerBodyProps {
  arrivals: IFirestoreFlightDocument[];
}

const blink = keyframes`
  0% { opacity: 0.0; }
  25% { opacity: 1.0; }
  50% { opacity: 1.0; }
  75% { opacity: 1.0; }
  100% { opacity: 0.0; }
`;

export const ArrivalViewerBody = ({ arrivals }: ArrivalViewerBodyProps) => {
  const [ticker, setTicker] = useState<number>(0);
  const blinkAnimation = `${blink} 3s infinite`;

  useEffect(() => {
    // To update state every 5 minutes and remove old flights
    const interval = setInterval(() => {
      setTicker(ticker + 1);
    }, 50000);

    return () => clearInterval(interval);
  });

  const animationPicker = (remark: string) => {
    switch (remark) {
      case 'ARRIVED':
      case 'DELAYED':
        return blinkAnimation;
      default:
        return '';
    }
  };

  return (
    <Box h="calc(100vh - 144px)" overflowY="hidden">
      {arrivals.map((flight, i) => {
        // For arrivals, show scheduledArrivalTime and actualArrivalTime
        const scheduledArrivalTimeDate = flight.data.scheduledArrivalTime ? flight.data.scheduledArrivalTime.toDate() : flight.data.scheduledDepartureTime.toDate();
        const actualArrivalTimeDate = flight.data.actualArrivalTime ? flight.data.actualArrivalTime.toDate() : flight.data.actualDepartureTime.toDate();
        const timeBeforeToViewFlight = new Date();
        timeBeforeToViewFlight.setMinutes(timeBeforeToViewFlight.getMinutes() - MINUTES_AFTER_DEP_TO_DISPLAY);

        if (scheduledArrivalTimeDate < timeBeforeToViewFlight) {
          return;
        }

        return (
          <Flex key={i} alignItems="center" gap={{ base: '2', sm: '4', md: '6', lg: '8' }} w="full" h={{ base: '40px', sm: '40px', md: '60px', lg: '72px' }} px="8" bg="gray.900" _even={{ bg: 'gray.600' }}>
            <Text textStyle="viewerBody" color="white" w={viewerWidths.flight / 100}>
              {flight.data.flightNumber}
            </Text>
            <Text textStyle="viewerBody" color="white" w={viewerWidths.destination / 100}>
              {flight.data.origin || flight.data.destination}
            </Text>
            <Text textStyle="viewerBody" color="white" w={viewerWidths.sched / 100}>
              {formatTime(scheduledArrivalTimeDate)}
            </Text>
            <Text textStyle="viewerBody" color="white" w={viewerWidths.board / 100}>
              {formatTime(actualArrivalTimeDate)}
            </Text>
            <Text textStyle="viewerBody" color="white" w={viewerWidths.gate / 100}>
              {flight.data.bell || 'N/A'}
            </Text>
            <Text textStyle="viewerBody" color="yellow.300" w={viewerWidths.remark / 100} animation={animationPicker((flight.data.arrivalRemark || '').toUpperCase())}>
              {(flight.data.arrivalRemark || '').toUpperCase()}
            </Text>
          </Flex>
        );
      })}
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
      <Flex w="full" h="72px" bg="gray.900" _even={{ bg: 'gray.600' }}></Flex>
    </Box>
  );
};
