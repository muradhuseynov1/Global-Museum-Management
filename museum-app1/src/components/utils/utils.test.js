import {
    validateEmail,
    validatePassword,
    isAtLeast18YearsOld,
    capitalizeName,
    validateLoginEmail,
    validateLoginPassword,
    geocodeAddressInReact,
    formatTimestamp,
    parseDateString,
    fetchMuseum
} from './utils';
import { differenceInYears } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn()
}));
  
describe('Utility Functions', () => {
    describe('validateEmail', () => {
      it('returns true for a valid email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
      });
  
      it('returns false for an invalid email without @ symbol', () => {
        expect(validateEmail('testexample.com')).toBe(false);
      });
  
      it('returns false for an email without a domain', () => {
        expect(validateEmail('test@')).toBe(false);
      });
  
      it('returns false for an email with spaces', () => {
        expect(validateEmail('test @ex ample.com')).toBe(false);
      });
    });
  
    describe('validatePassword', () => {
      it('returns true for a strong password', () => {
        expect(validatePassword('StrongPass123!')).toBe(true);
      });
  
      it('returns false for a password too short', () => {
        expect(validatePassword('Sho1!')).toBe(false);
      });
  
      it('returns false for a password missing a number', () => {
        expect(validatePassword('WeakPassword!')).toBe(false);
      });
  
      it('returns false for a password missing a special character', () => {
        expect(validatePassword('Weakpassword1')).toBe(false);
      });
    });
  
    describe('isAtLeast18YearsOld', () => {
      it('returns true for someone who is 18 years old today', () => {
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        expect(isAtLeast18YearsOld(eighteenYearsAgo)).toBe(true);
      });
  
      it('returns false for someone younger than 18', () => {
        const sixteenYearsAgo = new Date();
        sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
        expect(isAtLeast18YearsOld(sixteenYearsAgo)).toBe(false);
      });
    });
  
    describe('capitalizeName', () => {
      it('capitalizes a single lowercase name', () => {
        expect(capitalizeName('john')).toEqual('John');
      });
  
      it('capitalizes a full name properly', () => {
        expect(capitalizeName('john doe')).toEqual('John Doe');
      });
  
      it('handles mixed case input correctly', () => {
        expect(capitalizeName('jOhN DoE')).toEqual('John Doe');
      });
    });

    describe('validateLoginEmail', () => {
        it('returns error message for empty email', () => {
          expect(validateLoginEmail('')).toEqual("Email cannot be empty.");
        });
    
        it('returns error message for invalid email', () => {
          expect(validateLoginEmail('bademail.com')).toEqual("Please enter a valid email address.");
        });
    
        it('returns empty string for valid email', () => {
          expect(validateLoginEmail('good@email.com')).toEqual("");
        });
    });

    describe('validateLoginPassword', () => {
        it('returns error message for empty password', () => {
          expect(validateLoginPassword('')).toEqual("Password cannot be empty.");
        });
    
        it('returns error message for short password', () => {
          expect(validateLoginPassword('short')).toEqual("Password must be at least 6 characters long.");
        });
    
        it('returns empty string for valid password', () => {
          expect(validateLoginPassword('validPass123')).toEqual("");
        });
    });

    describe('geocodeAddressInReact', () => {
        beforeEach(() => {
          global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ lat: 10, lng: 20 })
          }));
          console.error = jest.fn();
        });
    
        it('returns coordinates for valid address', async () => {
          const result = await geocodeAddressInReact('123 Main St');
          expect(result).toEqual({ lat: 10, lng: 20 });
        });
    
        it('returns null on fetch failure', async () => {
          global.fetch.mockImplementationOnce(() => Promise.resolve({
            ok: false
          }));
          const result = await geocodeAddressInReact('123 Main St');
          expect(result).toBeNull();
        });
    
        it('handles fetch exceptions', async () => {
          global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));
          const result = await geocodeAddressInReact('123 Main St');
          expect(result).toBeNull();
        });
    });

    describe('formatTimestamp', () => {
        it('formats string timestamp correctly', () => {
            expect(formatTimestamp('2022-01-01')).toEqual('2022-01-01');
        });
    });

    describe('parseDateString', () => {
        it('parses valid date string correctly', () => {
          expect(parseDateString('01/02/2022').toISOString()).toEqual(new Date(2022, 1, 1).toISOString());
        });
    
        it('logs error and returns today\'s date for non-string input', () => {
          console.error = jest.fn();
          const today = new Date().toISOString().split('T')[0];
          expect(parseDateString(12345).toISOString().split('T')[0]).toEqual(today);
          expect(console.error).toHaveBeenCalled();
        });
    });

    describe('fetchMuseum', () => {
        const mockDocSnapshot = {
            exists: () => true,
            data: () => ({ name: 'Museum of Modern Art' })
        };
    
        it('returns museum data for existing document', async () => {
          getDoc.mockResolvedValue(mockDocSnapshot);
          const result = await fetchMuseum({ firestore: 'dummyFirestore' }, 'museumId');
          expect(result).toEqual({ success: true, data: { name: 'Museum of Modern Art' } });
        });
    
        it('returns error message for non-existent document', async () => {
          getDoc.mockResolvedValue({...mockDocSnapshot, exists: jest.fn(() => false)});
          const result = await fetchMuseum({ firestore: 'dummyFirestore' }, 'badId');
          expect(result).toEqual({ success: false, message: 'No such museum!' });
        });
    
        it('handles errors in fetching museum data', async () => {
          getDoc.mockRejectedValue(new Error('Error fetching'));
          const result = await fetchMuseum({ firestore: 'dummyFirestore' }, 'errorId');
          expect(result).toEqual({ success: false, message: 'Error fetching museum: Error fetching' });
        });
    });
});
  