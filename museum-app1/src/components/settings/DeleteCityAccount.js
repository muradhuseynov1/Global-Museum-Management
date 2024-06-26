import { firestore, storage, functions } from '../../firebase';
import { deleteDoc, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'; 
import { ref, listAll, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

const deleteFolderContents = async (path) => {
    const dirRef = ref(storage, path);
    try {
        const listResponse = await listAll(dirRef);

        const itemDeletions = listResponse.items.map(itemRef => 
            deleteObject(itemRef).catch(error => 
                console.error("Error deleting item:", itemRef.fullPath, error)
            )
        );
        await Promise.all(itemDeletions);

        for (const subDir of listResponse.prefixes) {
            await deleteFolderContents(subDir.fullPath);
        }
    } catch (error) {
        console.error("Error deleting storage contents at path:", path, error);
    }
};

const deleteMuseumMedia = async (museumId) => {
    await deleteFolderContents(`museums/${museumId}`).catch(error => 
        console.error("Error in deleteMuseumMedia for museumId:", museumId, error)
    );
};

const deleteAssociatedData = async (cityId, userId) => {
    try {
        const cityIdQuery = query(collection(firestore, "cityIDs"), where("id", "==", cityId));
        const cityIdSnapshot = await getDocs(cityIdQuery);
        await Promise.all(cityIdSnapshot.docs.map(doc => deleteDoc(doc.ref)));

        const museumsQuery = query(collection(firestore, "museums"), where("cityID", "==", cityId));
        const museumsSnapshot = await getDocs(museumsQuery);

        const deletionPromises = museumsSnapshot.docs.map(async (museumDoc) => {
            const museumId = museumDoc.id;

            const reviewsQuery = query(collection(firestore, "reviews"), where("museumId", "==", museumId));
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewDeletions = reviewsSnapshot.docs.map(reviewDoc => deleteDoc(reviewDoc.ref));

            await Promise.all(reviewDeletions);
            await deleteMuseumMedia(museumId);
            await deleteDoc(museumDoc.ref); 
        });

        await Promise.all(deletionPromises);

    } catch (error) {
        console.error("Error in deleteAssociatedData:", error);
        throw new Error("Failed to delete associated data");
    }
};

const DeleteCityAccount = async (userId) => {
    try {
        console.log(`Attempting to delete city account with userId: ${userId}`);
        const userDocRef = doc(firestore, 'cityRegistrars', userId);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error("User document does not exist");

        const cityId = userDoc.data().cityID;
        console.log(`City ID associated with userId ${userId} is ${cityId}`);
        await deleteAssociatedData(cityId, userId);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await deleteDoc(userDocRef);
        
        console.log("Calling cloud function to delete user authentication...");
        const deleteUserAccount = httpsCallable(functions, 'deleteUserAccount');
        const result = await deleteUserAccount({ userId });

        if (!result.data.success) {
            throw new Error(result.data.error);
        }

        console.log("City account and all related data have been successfully deleted.");
        return true;
        
    } catch (error) {
        console.error('Error deleting city account:', error);
        return false;
    }
};

export default DeleteCityAccount;
