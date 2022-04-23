import '../styles/reset.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (url: string) => fetch(url).then(response => response.json()) }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  )
}
export default MyApp
