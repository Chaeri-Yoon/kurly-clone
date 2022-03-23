import Head from "next/head";
import Header from "./HeaderParts/Header";

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