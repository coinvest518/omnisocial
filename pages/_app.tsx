import "../styles/globals.css";
import "../styles/animations.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { FC } from "react";

// Define the App component
const MyApp: FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {

    return (
      // Wrap the Component with SessionProvider
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

export default MyApp;
