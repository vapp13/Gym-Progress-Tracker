import GoogleSignInButton from '../features/auth/GoogleSignInButton';

function Login() {
  return (
    <div>
      <h1>Welcome to Fitness App</h1>
      <p>Sign in to track your workouts and progress.</p>
      <GoogleSignInButton />
    </div>
  );
}

export default Login;