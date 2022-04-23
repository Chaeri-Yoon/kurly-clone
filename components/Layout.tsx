import Head from "next/head";
import useSWR from "swr";
import Header from "./HeaderParts/Header";

export default function Layout({ children }: any) {
    const { data } = useSWR('/api/user');
    return (
        <>
            <Head><title>Kurly :: Daily Groceries</title></Head>
            {data?.user ? <Header loggedUser={data?.user} /> : <Header />}
            <main>
                {children}
            </main>
        </>
    )
}