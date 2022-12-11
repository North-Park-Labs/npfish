import { Driver } from 'components/Driver'
import Head from 'next/head'
import NoSSR from 'react-no-ssr'
export default function Home() {
  return (
    <div>
      <Head>
        <title>NPFISH</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Driver />
      </main>
    </div>
  )
}
