import { useFirebaseUser } from 'src/lib/firebase';

function UserSettings() {
  const [user, loading, error] = useFirebaseUser();
  return (
    <p>UserSettings Page Works</p>
  );
}

export default UserSettings;
