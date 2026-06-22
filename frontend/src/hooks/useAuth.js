// Import useContext and custom auth context.
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook to consume the AuthContext state safely.
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export useAuth hook.
export default useAuth;
