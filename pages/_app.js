import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gray-50 dark:bg-black">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
