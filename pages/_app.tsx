import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { GlobalStateProvider } from '../store/store'

const queryClient = new QueryClient()

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
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
