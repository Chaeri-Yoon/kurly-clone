import Head from "next/head";
import Header from "../page-components/HeaderParts/Header";

export default function Layout({ children }: any) {
    return (
        <>
            <Head><title>Kurly :: Daily Groceries</title></Head>
            <Header />
            <main>
                {children}
            </main>
        </>
    )
}