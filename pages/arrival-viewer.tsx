import { LogoIcon } from '@/components/LogoIcon';
import { StandardPage } from '@/components/StandardPage';
import { ArrivalViewerBody } from '@/components/arrival-viewer/ArrivalViewerBody';
import { ArrivalViewerHeader } from '@/components/arrival-viewer/ArrivalViewerHeader';
import { useAirline } from '@/hooks/useAirline';
import { useArrivals } from '@/hooks/useArrivals';
import { Button, Divider, FormControl, FormLabel, Heading, Icon, Input } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ArrivalViewer = () => {
  const router = useRouter();
  const { ac } = router.query;
  const [inputAirlineCode, setInputAirlineCode] = useState<string>();
  const { arrivals } = useArrivals(ac as string);
  const { airlineData } = useAirline(ac as string);

  return (
    <>
      <Head>
        <title>Arrival Viewer | flyview</title>
        <meta name="description" content="Arrival Viewer | flyview" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!ac ? (
        <StandardPage>
          <Icon as={LogoIcon} color="jet.500" boxSize="10" mb="4" onClick={() => router.push('/')} cursor="pointer" />
          <Heading>Arrival Viewer</Heading>
          <Divider />
          <FormControl>
            <FormLabel>Airline Code</FormLabel>
            <Input isRequired={true} placeholder="ABC123DEF456" onChange={(e) => setInputAirlineCode(e.target.value)} />
          </FormControl>
          <Button mt="4" colorScheme="jet" onClick={() => inputAirlineCode && router.push('/arrival-viewer?ac=' + inputAirlineCode)} isDisabled={!inputAirlineCode}>
            View
          </Button>
        </StandardPage>
      ) : (
        <>
          <ArrivalViewerHeader airlineName={airlineData?.name || 'Unnamed'} logo={airlineData?.logo || 'https://via.placeholder.com/728x143'} headerColor={airlineData?.headerColor || '#2A272A'} textColor={airlineData?.textColor || '#FFFFFF'} />
          <ArrivalViewerBody arrivals={arrivals} />
        </>
      )}
    </>
  );
};

export default ArrivalViewer;
