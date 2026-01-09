import { db } from '@/firebaseConfig';
import { IFirestoreFlightDocument } from '@/types/flight';
import { getCurrentDayDateRange } from '@/utils/dateUtils';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useLatestFlight = (airlineCode: string = '') => {
  const [latestFlight, setLatestFlight] = useState<IFirestoreFlightDocument | null>(null);

  useEffect(() => {
    if (!airlineCode) {
      setLatestFlight(null);
      return () => {}; // Return empty cleanup function
    }

    const { pastMidnight, nextMidnight } = getCurrentDayDateRange();

    const flightsRef = collection(db, 'flights');
    const q = query(
      flightsRef,
      where('airlineCode', '==', airlineCode),
      where('actualDepartureTime', '>', pastMidnight),
      where('actualDepartureTime', '<', nextMidnight),
      orderBy('created', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const doc = snapshot.docs[0];
        setLatestFlight({
          ref: doc.ref,
          data: doc.data()
        });
      } else {
        setLatestFlight(null);
      }
    });

    return () => unsubscribe();
  }, [airlineCode]);

  return {
    latestFlight
  };
};
