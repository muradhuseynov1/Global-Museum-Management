import Reauthenticate from "./Reauthenticate";
import { auth } from "../../firebase";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

jest.mock("../../firebase", () => ({
    auth: {
        currentUser: {
            email: "text@example.com"
        }
    }
}));
jest.mock("firebase/auth", () => ({
    reauthenticateWithCredential: jest.fn(),
    EmailAuthProvider: {
        credential: jest.fn(() => "mock-credential")
    }
}));

describe("Reauthenticate Function", () => {
    it('should re-authenticate a user with correct credentials', async () => {
        const mockPassword = 'correct-password';
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, mockPassword);
        await expect(Reauthenticate(mockPassword)).resolves.not.toThrow();
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(user, credential);
    });
});