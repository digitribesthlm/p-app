import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <MobileMenu />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
