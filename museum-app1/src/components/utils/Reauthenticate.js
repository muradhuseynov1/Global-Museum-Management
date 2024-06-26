import { auth } from '../../firebase';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Reauthenticate = async (currentPassword) => {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not found or not logged in");

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
};

export default Reauthenticate;
