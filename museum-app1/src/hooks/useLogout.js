import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const useLogout = () => {
  const navigate = useNavigate();
  
  const logout = async () => {
    try {
      setTimeout(async () => {
        await signOut(auth);
        navigate('/', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { logout };
};

export default useLogout;
