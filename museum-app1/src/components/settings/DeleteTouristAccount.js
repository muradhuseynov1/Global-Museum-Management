import { firestore, functions } from '../../firebase';
import { deleteDoc, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const deleteTouristBookings = async (touristId) => {
    const bookingsQuery = query(collection(firestore, "bookings"), where("touristId", "==", touristId));
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookingDeletions = bookingsSnapshot.docs.map(booking => deleteDoc(booking.ref));
    await Promise.all(bookingDeletions);
    console.log("All bookings deleted for tourist ID:", touristId);
};

const DeleteTouristAccount = async (userId) => {
    try {
        console.log("Starting to delete tourist account for userId:", userId);
        const userDocRef = doc(firestore, 'tourists', userId);
        console.log("Retrieving tourist document...");
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error("Tourist document does not exist");

        console.log("Deleting all bookings related to the tourist...");
        await deleteTouristBookings(userId);

        console.log("Deleting the tourist document...");
        await deleteDoc(userDocRef);

        console.log("Calling cloud function to delete user authentication...");
        const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
        const result = await deleteUserAccount({ userId });

        if (!result.data.success) {
            throw new Error(result.data.error);
        }

        console.log("Tourist account and all related data have been successfully deleted.");
        return true; 
    } catch (error) {
        console.error('Error during the tourist account deletion process:', error);
        return false;
    }
};

export default DeleteTouristAccount;
