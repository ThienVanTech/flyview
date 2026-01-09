import { DocumentData, DocumentReference } from 'firebase/firestore';

export interface IFirestoreFlightDocument {
  ref: DocumentReference;
  data: DocumentData;
}
