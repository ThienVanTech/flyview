import { db } from '@/firebaseConfig';
import { IFirestoreFlightDocument } from '@/types/flight';
import { getCurrentDayDateRange } from '@/utils/dateUtils';
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch the latest flight by creation timestamp for a given airline code.
 * 
 * Note: This hook requires:
 * 1. All flight documents to have a 'created' field (set via serverTimestamp())
 * 2. A Firestore composite index with fields:
 *    - airlineCode (ascending)
 *    - actualDepartureTime (ascending)
 *    - created (descending)
 * 
 * The query orders by actualDepartureTime first (required by Firestore when using
 * inequality filters), then by created DESC to get the most recently created flight.
 * 
 * @param airlineCode The airline code to filter flights
 * @returns Object containing the latest flight document or null if none found
 */
export const useLatestFlight = (airlineCode: string = '') => {
  const [latestFlight, setLatestFlight] = useState<IFirestoreFlightDocument | null>(null);

  useEffect(() => {
    if (!airlineCode) {
      setLatestFlight(null);
      return;
    }

    const { pastMidnight, nextMidnight } = getCurrentDayDateRange();

    const flightsRef = collection(db, 'flights');
    const q = query(
      flightsRef,
      where('airlineCode', '==', airlineCode),
      where('actualDepartureTime', '>', pastMidnight),
      where('actualDepartureTime', '<', nextMidnight),
      orderBy('actualDepartureTime', 'asc'),
      orderBy('scheduledDepartureTime', 'asc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          const doc = snapshot.docs[0];
          setLatestFlight({
            ref: doc.ref,
            data: doc.data()
          });
        } else {
          setLatestFlight(null);
        }
      },
      (error) => {
        console.error('Error fetching latest flight:', error);
        setLatestFlight(null);
      }
    );

    return () => unsubscribe();
  }, [airlineCode]);

  return {
    latestFlight
  };
};
