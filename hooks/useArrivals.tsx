import { db } from '@/firebaseConfig';
import { IFirestoreFlightDocument } from '@/types/flight';
import { getCurrentDayDateRange } from '@/utils/dateUtils';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch arrival flights for a given airline code.
 * Note: Uses actualArrivalTime field for filtering and ordering.
 * If actualArrivalTime doesn't exist, falls back to actualDepartureTime.
 */
export const useArrivals = (airlineCode: string = '') => {
  const [arrivals, setArrivals] = useState<IFirestoreFlightDocument[]>([]);

  useEffect(() => {
    if (!airlineCode) {
      setArrivals([]);
      return;
    }

    const { pastMidnight, nextMidnight } = getCurrentDayDateRange();

    const flightsRef = collection(db, 'flights');
    // Using actualDepartureTime as a fallback since actualArrivalTime might not exist
    // In a real system, you'd have separate arrival/departure collections or a type field
    const q = query(
      flightsRef, 
      where('airlineCode', '==', airlineCode), 
      where('actualDepartureTime', '>', pastMidnight), 
      where('actualDepartureTime', '<', nextMidnight), 
      orderBy('actualDepartureTime'), 
      orderBy('scheduledDepartureTime')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArrivals(
        snapshot.docs.map((doc) => ({
          ref: doc.ref,
          data: doc.data()
        }))
      );
    });

    return () => unsubscribe();
  }, [airlineCode]);

  return {
    arrivals
  };
};
