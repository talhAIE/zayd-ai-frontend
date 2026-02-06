import { useNavigate } from 'react-router-dom';

export function useNavigation() {
  const navigate = useNavigate();

  const goToOnboarding = () => {
    navigate('/login');
  };

  return {
    goToOnboarding,
  };
}
