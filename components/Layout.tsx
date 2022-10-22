import Head from "next/head";
import useSWR from "swr";
import Header from "./HeaderParts/Header";

export default function Layout({ children }: any) {
    const { data } = useSWR('/api/user?field=name');
    return (
        <>
            <Head><title>Kurly :: Daily Groceries</title></Head>
            {data?.loggedUser ? <Header loggedUser={data?.loggedUser} /> : <Header />}
            <main>
                {children}
                <div id="portal" />
            </main>
        </>
    )
}