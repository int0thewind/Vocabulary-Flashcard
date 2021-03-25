import React from 'react';
import { useAuth } from 'reactfire';
import 'firebaseui/dist/firebaseui.css';

type Props = {
  uiConfig: firebaseui.auth.Config;
};

function FirebaseUI({ uiConfig }: Props) {
  const auth = useAuth();
  const fbUIRef: React.LegacyRef<HTMLDivElement> = React.useRef();

  React.useEffect(() => {
    let ui: firebaseui.auth.AuthUI | null = null;
    import('firebaseui').then((firebaseui) => {
      ui = new firebaseui.auth.AuthUI(auth);
      ui.start('#firebase-ui', uiConfig);
    });
    return () => { if (ui) ui.delete(); };
  });

  return (
    <div id="firebase-ui" ref={fbUIRef} />
  );
}

export default FirebaseUI;
