import { dbBoTai, dbSwan, collection, getDocs } from "./firebaseConfig";

// Define TypeScript interfaces for the data
interface Reservation {
  id: string;
  source: string;
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  timeSlot?: string;
  timing?: string;
  persons?: number;
  createdAt?: number;
}

interface Review {
  id: string;
  source: string;
  name?: string;
  email?: string;
  mobile?: string;
  dob?: string;
  comment?: string;
  rating?: string;
  anniversary?: string;
  createdAt?: number;
}
interface ContactQuery {
  id: string;
  source: string;
  fullName?: string;
  email?: string;
  notes?: string;
  createdAt?: number;
}

// Fetch Reservations from both Firestore databases
const fetchReservations = async (): Promise<Reservation[]> => {
  try {
    const querySnapshotBoTai = await getDocs(collection(dbBoTai, "Reservations"));
    const dataBoTai: Reservation[] = querySnapshotBoTai.docs.map(doc => ({
      id: doc.id,
      source: "Bo-Tai",
      ...doc.data(),
    }));

    const querySnapshotSwan = await getDocs(collection(dbSwan, "Reservations"));
    const dataSwan: Reservation[] = querySnapshotSwan.docs.map(doc => ({
      id: doc.id,
      source: "Swan",
      ...doc.data(),
    }));

    return [...dataBoTai, ...dataSwan];
  } catch (error) {
    console.error("Error fetching reservations: ", error);
    return [];
  }
};

// Fetch Reviews from both Firestore databases
const fetchReviews = async (): Promise<Review[]> => {
  try {
    const querySnapshotBoTai = await getDocs(collection(dbBoTai, "reviews"));
    const dataBoTai: Review[] = querySnapshotBoTai.docs.map(doc => ({
      id: doc.id,
      source: "Bo-Tai",
      ...doc.data(),
    }));

    const querySnapshotSwan = await getDocs(collection(dbSwan, "reviews"));
    const dataSwan: Review[] = querySnapshotSwan.docs.map(doc => ({
      id: doc.id,
      source: "Swan",
      ...doc.data(),
    }));

    return [...dataBoTai, ...dataSwan];
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

const fetchContactQueries = async (): Promise<ContactQuery[]> => {
  try {
    const querySnapshotBoTai = await getDocs(collection(dbBoTai, "ContactQuries"));
    const dataBoTai: ContactQuery[] = querySnapshotBoTai.docs.map(doc => ({
      id: doc.id,
      source: "Bo-Tai",
      ...doc.data(),
    }));

    const querySnapshotSwan = await getDocs(collection(dbSwan, "ContactQuries"));
    const dataSwan: ContactQuery[] = querySnapshotSwan.docs.map(doc => ({
      id: doc.id,
      source: "Swan",
      ...doc.data(),
    }));

    return [...dataBoTai, ...dataSwan];
  } catch (error) {
    console.error("Error fetching contact queries: ", error);
    return [];
  }
};
export { fetchReservations, fetchReviews, fetchContactQueries };
export type { Reservation, Review, ContactQuery };