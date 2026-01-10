import { Clock } from '@/components/Clock';
import { viewerWidths } from '@/pages/viewer';
import { Flex, Heading, HStack, Image, Text } from '@chakra-ui/react';

export const BaggageViewerHeader = () => {
  return (
    <Flex direction="column" w="full">
      <HStack w="full" h="72px" px="8" py="8" bg="blue.600">
        <Image src="/logo.png" w="72px" h="72px" />
        <Heading size="3xl" color="white">
          FlyView
        </Heading>
      </HStack>
      <Flex alignItems="center" gap={{ base: '2', sm: '4', md: '6', lg: '8' }} w="full" h="72px" px="8" bg="blue.600">
        <Heading size="md" color="white" w={viewerWidths.flight / 100}>
          Flight
        </Heading>
        <Heading size="md" color="white" w={viewerWidths.destination / 100}>
          Origin
        </Heading>
        <Heading size="md" color="white" w={viewerWidths.remark / 100}>
          Status
        </Heading>
        <Clock />
      </Flex>
      <Flex alignItems="center" gap={{ base: '2', sm: '4', md: '6', lg: '8' }} w="full" h="72px" px="8" bg="blue.600">
        <Heading size="2xl" color="white" w="full" textAlign="center">
          Baggage Claim Information
        </Heading>
      </Flex>
    </Flex>
  );
};
