import { db } from '@/firebaseConfig';
import { collection, DocumentData, DocumentReference, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useLatestFlight = (airlineCode: string = '') => {
  const [latestFlight, setLatestFlight] = useState<IFirestoreFlightDocument | null>(null);

  useEffect(() => {
    if (!airlineCode) {
      setLatestFlight(null);
      return;
    }

    const pastMidnight = new Date();
    pastMidnight.setHours(0, 0, 0, 0); // Get the first midnight in the past (start of current day)
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); // Get the first midnight in the future (end of current day)

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

export interface IFirestoreFlightDocument {
  ref: DocumentReference;
  data: DocumentData;
}
