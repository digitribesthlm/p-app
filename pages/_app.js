import "@/styles/globals.css";
import MobileMenu from '../components/MobileMenu';
import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  return (
    <>
      <MobileMenu />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
