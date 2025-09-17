import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { crossTabLogout } from '@/redux/slices/authSlice';

export const useCrossTabLogout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'logoutEvent' && e.newValue) {
        dispatch(crossTabLogout());
      }
      
      if (e.key === 'loginEvent' && e.newValue) {
        window.location.reload();
      }
      
      if (e.key === 'AiTutorUser' && e.newValue === null) {
        dispatch(crossTabLogout());
      }
      
      if (e.key === 'token' && e.newValue === null) {
        dispatch(crossTabLogout());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);
};
