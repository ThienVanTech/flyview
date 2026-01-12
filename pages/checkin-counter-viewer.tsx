import { LogoIcon } from '@/components/LogoIcon';
import { StandardPage } from '@/components/StandardPage';
import { CheckinCounterViewerBody } from '@/components/checkin-counter-viewer/CheckinCounterViewerBody';
import { CheckinCounterViewerHeader } from '@/components/checkin-counter-viewer/CheckinCounterViewerHeader';
import { useAirline } from '@/hooks/useAirline';
import { useLatestFlight } from '@/hooks/useLatestFlight';
import { Button, Divider, FormControl, FormLabel, Heading, Icon, Input } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

const CheckinCounterViewer = () => {
  const router = useRouter();
  const { ac } = router.query;
  const [inputAirlineCode, setInputAirlineCode] = useState<string>();
  const { latestFlight } = useLatestFlight(ac as string);
  const { airlineData } = useAirline(ac as string);

  return (
    <>
      <Head>
        <title>Check-in Counter Viewer | flyview</title>
        <meta name="description" content="Check-in Counter Viewer | flyview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!ac ? (
        <StandardPage>
          <Icon as={LogoIcon} color="jet.500" boxSize="10" mb="4" onClick={() => router.push('/')} cursor="pointer" />
          <Heading>Check-in Counter Viewer</Heading>
          <Divider />
          <FormControl>
            <FormLabel>Airline Code</FormLabel>
            <Input isRequired={true} placeholder="ABC123DEF456" onChange={(e) => setInputAirlineCode(e.target.value)} />
          </FormControl>
          <Button mt="4" colorScheme="jet" onClick={() => inputAirlineCode && router.push('/checkin-counter-viewer?ac=' + inputAirlineCode)} isDisabled={!inputAirlineCode}>
            View
          </Button>
        </StandardPage>
      ) : (
        <>
          <CheckinCounterViewerHeader airlineName={airlineData?.name || 'Unnamed'} logo={airlineData?.logo || 'https://via.placeholder.com/728x143'} headerColor={airlineData?.headerColor || '#2A272A'} textColor={airlineData?.textColor || '#FFFFFF'} />
          <CheckinCounterViewerBody flight={latestFlight} />
        </>
      )}
    </>
  );
};

export default CheckinCounterViewer;
