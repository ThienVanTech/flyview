import { db } from '@/firebaseConfig';
import { IFirestoreFlightDocument } from '@/types/flight';
import { getCurrentDayDateRange } from '@/utils/dateUtils';
import { addDoc, collection, deleteDoc, DocumentReference, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export const useFlights = (airlineCode: string = '') => {
  const [flights, setFlights] = useState<IFirestoreFlightDocument[]>([]);

  useEffect(() => {
    if (!airlineCode) {
      setFlights([]);
      return;
    }

    const { pastMidnight, nextMidnight } = getCurrentDayDateRange();

    const flightsRef = collection(db, 'flights');
    const q = query(flightsRef, where('airlineCode', '==', airlineCode), where('actualDepartureTime', '>', pastMidnight), where('actualDepartureTime', '<', nextMidnight), orderBy('actualDepartureTime'), orderBy('scheduledDepartureTime'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setFlights(
          snapshot.docs.map((doc) => ({
            ref: doc.ref,
            data: doc.data()
          }))
        );
      },
      (error) => {
        console.error('Error fetching flights:', error);
        setFlights([]);
      }
    );

    return () => unsubscribe();
  }, [airlineCode]);

  /***
   * Adds a flight to the firestore database
   *
   * @param {string} airlineCode the airline's code
   * @param {string} flightNumber the flight number
   * @param {string} origin the flight's origin
   * @param {string} destination the flight's destination
   * @param {Date} scheduledDepartureTime the scheduled departure time
   * @param {Date} scheduledBoardingTime the scheduled boarding time
   * @param {Date} scheduledArrivalTime the scheduled arrival time
   * @param {number} gate the flight's departure gate
   * @param {number} bell the baggage carousel number
   * @return a promise pointing to the newly created document reference
   */
  const addFlight = (airlineCode: string, flightNumber: string, origin: string, destination: string, scheduledDepartureTime: Date, scheduledBoardingTime: Date, scheduledArrivalTime: Date, gate: number, bell: number) => {
    const flightsColRef = collection(db, 'flights');
    return addDoc(flightsColRef, {
      airlineCode,
      flightNumber,
      origin,
      destination,
      scheduledDepartureTime,
      actualDepartureTime: scheduledDepartureTime,
      scheduledBoardingTime,
      actualBoardingTime: scheduledBoardingTime,
      scheduledArrivalTime,
      actualArrivalTime: scheduledArrivalTime,
      gate,
      bell,
      remark: '',
      created: serverTimestamp()
    });
  };

  /***
   * Update a flight in the firestore database
   *
   * @param {DocumentReference} docRef the reference to the flight document to update
   * @param {object} newValues the new values to store in the document
   * @return a promise resolving once the data is successfully written
   */
  const updateFlight = (docRef: DocumentReference, newValues: {}) => {
    return updateDoc(docRef, newValues);
  };

  /***
   * Delete a flight in the firestore database
   *
   * @param {DocumentReference} docRef the reference to the flight document to delete
   * @return a promise resolving once the data is successfully deleted
   */
  const deleteFlight = (docRef: DocumentReference) => {
    return deleteDoc(docRef);
  };

  return {
    flights,
    addFlight,
    updateFlight,
    deleteFlight
  };
};

// Re-export the shared type for backward compatibility
export type { IFirestoreFlightDocument } from '@/types/flight';
