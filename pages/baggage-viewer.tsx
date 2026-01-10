import { BaggageViewerBody } from '@/components/baggage-viewer/BaggageViewerBody';
import { BaggageViewerHeader } from '@/components/baggage-viewer/BaggageViewerHeader';
import { useArrivals } from '@/hooks/useArrivals';
import { Button, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

const BaggageViewer = () => {
  const [airlineCodeInput, setAirlineCodeInput] = useState('');
  const [airlineCode, setAirlineCode] = useState('');
  const { arrivals } = useArrivals(airlineCode);

  const handleSubmit = () => {
    setAirlineCode(airlineCodeInput);
  };

  return (
    <>
      {!airlineCode && (
        <VStack minH="100vh" justify="center" p={10}>
          <FormControl isRequired>
            <FormLabel>Airline Code</FormLabel>
            <Input placeholder="e.g. ABC123DEF456" value={airlineCodeInput} onChange={(e) => setAirlineCodeInput(e.target.value)} />
          </FormControl>
          <Button isDisabled={!airlineCodeInput} colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </VStack>
      )}
      {airlineCode && (
        <Flex direction="column" w="full" h="full">
          <BaggageViewerHeader />
          <BaggageViewerBody arrivals={arrivals} />
          {arrivals.length === 0 && (
            <Text textAlign="center" fontSize="2xl" mt={8}>
              No baggage information available
            </Text>
          )}
        </Flex>
      )}
    </>
  );
};

export default BaggageViewer;
