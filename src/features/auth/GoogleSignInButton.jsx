import { useAuth } from '../../context/AuthContext';

function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();

  const handleClick = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign-in failed:', error.message);
    }
  };

  return (
    <button onClick={handleClick}>
      Sign in with Google
    </button>
  );
}

export default GoogleSignInButton;