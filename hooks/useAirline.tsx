import { db } from '@/firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useAirline = (airlineCode: string = '') => {
  const [airlineData, setAirlineData] = useState<IAirlineData>();

  useEffect(() => {
    if (!airlineCode || !db) return;

    const airlineDocRef = doc(db, 'airlines', airlineCode);

    const unsubscribe = onSnapshot(airlineDocRef, (doc) => {
      setAirlineData({
        name: doc.data()?.name || 'Unnamed',
        logo: doc.data()?.logo || 'https://via.placeholder.com/728x143',
        headerColor: doc.data()?.headerColor || '#2A272A',
        textColor: doc.data()?.textColor || '#FFFFFF'
      });
    });

    return () => unsubscribe();
  }, [airlineCode, db]);

  /***
   * Update the airline in the firestore database
   *
   * @param {object} newValues the new values to store in the document
   * @return a promise resolving once the data is successfully written
   */
  const updateAirline = (newValues: {}) => {
    if (!db) {
      return Promise.reject(new Error('Firebase Firestore is not initialized. Please check your Firebase configuration.'));
    }
    const airlineDocRef = doc(db, 'airlines', airlineCode);

    return setDoc(airlineDocRef, newValues, { merge: true });
  };

  return {
    airlineData,
    updateAirline
  };
};

interface IAirlineData {
  name: string;
  logo: string;
  headerColor: string;
  textColor: string;
}
