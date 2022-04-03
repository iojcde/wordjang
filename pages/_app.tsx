import type { AppProps /*, AppContext */ } from 'next/app'
import 'styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Nav from 'components/Nav'
import Footer from 'components/Footer'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Nav />

      <div className="px-4 py-4 lg:px-8 max-w-4xl mx-auto mt-8 min-h-[85vh]">
        <Component {...pageProps} />
      </div>
      <Footer />
    </SessionProvider>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
