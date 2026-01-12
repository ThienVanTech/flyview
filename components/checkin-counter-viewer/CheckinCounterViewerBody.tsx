import { IFirestoreFlightDocument } from '@/types/flight';
import { formatTime } from '@/utils/dateUtils';
import { Box, Flex, keyframes, Text, VStack } from '@chakra-ui/react';

const blink = keyframes`
  0% { opacity: 0.0; }
  25% { opacity: 1.0; }
  50% { opacity: 1.0; }
  75% { opacity: 1.0; }
  100% { opacity: 0.0; }
`;

interface CheckinCounterViewerBodyProps {
  flight: IFirestoreFlightDocument | null;
}

export const CheckinCounterViewerBody = ({ flight }: CheckinCounterViewerBodyProps) => {
  const blinkAnimation = `${blink} 3s infinite`;

  if (!flight) {
    return (
      <Box h="calc(100vh - 120px)" display="flex" alignItems="center" justifyContent="center" bg="gray.900">
        <Text textStyle="viewerHeaderTitle" color="white">
          No flight available
        </Text>
      </Box>
    );
  }

  // Add null checks for date fields
  if (!flight.data.scheduledDepartureTime) {
    return (
      <Box h="calc(100vh - 120px)" display="flex" alignItems="center" justifyContent="center" bg="gray.900">
        <Text textStyle="viewerHeaderTitle" color="white">
          Invalid flight data
        </Text>
      </Box>
    );
  }

  // Defensive type checking: ensure these are Firestore Timestamp objects
  let departureTimeDate: Date;
  
  try {
    departureTimeDate = flight.data.scheduledDepartureTime.toDate ? flight.data.scheduledDepartureTime.toDate() : new Date(flight.data.scheduledDepartureTime);
  } catch (error) {
    return (
      <Box h="calc(100vh - 120px)" display="flex" alignItems="center" justifyContent="center" bg="gray.900">
        <Text textStyle="viewerHeaderTitle" color="white">
          Invalid date format
        </Text>
      </Box>
    );
  }
  
  const remarkUpper = (flight.data.remark ?? '').toUpperCase();

  const animationPicker = (remark: string) => {
    switch (remark) {
      case 'BOARDING':
      case 'FINAL CALL':
        return blinkAnimation;
      default:
        return '';
    }
  };

  return (
    <Box h="calc(100vh - 120px)" bg="gray.900" display="flex" alignItems="center" justifyContent="center" px="8">
      <VStack spacing={{ base: '8', md: '12', lg: '16' }} w="full" maxW="1400px">
        {/* Flight Number */}
        <Flex direction="column" alignItems="center" w="full">
          <Text textStyle="viewerHeader" color="gray.400" mb="2">
            Flight
          </Text>
          <Text fontSize={{ base: '4xl', md: '6xl', lg: '8xl' }} fontWeight="bold" color="white">
            {flight.data.flightNumber}
          </Text>
        </Flex>

        {/* Destination */}
        <Flex direction="column" alignItems="center" w="full">
          <Text textStyle="viewerHeader" color="gray.400" mb="2">
            Destination
          </Text>
          <Text fontSize={{ base: '3xl', md: '5xl', lg: '7xl' }} fontWeight="bold" color="white">
            {flight.data.destination}
          </Text>
        </Flex>

        {/* Departure Time */}
        <Flex direction="column" alignItems="center" w="full">
          <Text textStyle="viewerHeader" color="gray.400" mb="2">
            Scheduled Departure
          </Text>
          <Text fontSize={{ base: '3xl', md: '4xl', lg: '6xl' }} fontWeight="bold" color="white">
            {formatTime(departureTimeDate)}
          </Text>
        </Flex>

        {/* Remark */}
        {flight.data.remark && (
          <Flex direction="column" alignItems="center" w="full">
            <Text textStyle="viewerHeader" color="gray.400" mb="2">
              Status
            </Text>
            <Text fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }} fontWeight="bold" color="yellow.300" animation={animationPicker(remarkUpper)}>
              {remarkUpper}
            </Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
};
