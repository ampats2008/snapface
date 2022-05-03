import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { GlobalStateProvider } from '../store/store'
import { useCallback } from 'react'

const queryClient = new QueryClient()

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  useCallback(() => {
    // disable logging in production environments
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {}
      console.error = () => {}
      console.debug = () => {}
    }
  }, [process.env.NODE_ENV])

  return (
    <GlobalStateProvider>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Layout {...{ router }}>
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </SessionProvider>
    </GlobalStateProvider>
  )
}

export default MyApp
