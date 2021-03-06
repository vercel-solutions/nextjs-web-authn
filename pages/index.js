import { useState, useEffect } from 'react';
import Head from 'next/head';
import { magic } from '../lib/magic';

export default function Index() {
  const [user, setUser] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isLoginLoading, setLoginLoading] = useState(false);
  const [isChrome, setIsChrome] = useState(true);
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    if (!window.chrome) {
      setIsChrome(false);
      alert(
        'This demo is only supported on Google Chrome on a laptop or desktop. Demos on other browsers and platforms are coming soon!'
      );
    }

    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      if (magicIsLoggedIn) {
        setLoading(true);
        const metadata = await magic.webauthn.getMetadata();
        setUser(metadata);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const register = async (e) => {
    e.preventDefault();

    setLoginLoading(true);
    try {
      await magic.webauthn.registerNewUser({
        username: e.target.username.value,
      });
      const metadata = await magic.webauthn.getMetadata();
      setUser(metadata);
    } catch (e) {
      if (e.message.includes('Username already exist!')) {
        alert('This username already exists. Please log in below.');
      } else {
        alert(e.message);
      }
    }

    setLoginLoading(false);
  };

  const login = async (e) => {
    e.preventDefault();

    setLoginLoading(true);
    try {
      await magic.webauthn.login({
        username: e.target.username.value,
      });
      const metadata = await magic.webauthn.getMetadata();
      setUser(metadata);
    } catch (e) {
      alert('There was an error logging in. Please try again.');
    }

    setLoginLoading(false);
  };

  const logout = async () => {
    setLoginLoading(true);
    await magic.user.logout();
    setLoginLoading(false);
    setUser(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Web Authn ??? Next.js and Magic Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <div className="flex justify-center items-center bg-white dark:bg-black shadow-md rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
          <img src="/magic.svg" alt="Magic Logo" className="h-8 sm:h-16" />
        </div>
        <h1 className="text-lg sm:text-2xl font-bold mb-2 text-black dark:text-white">
          WebAuthn Login with Magic
        </h1>
        <h2 className="text-md sm:text-xl mx-4 text-gray-700 dark:text-gray-300">
          Login with Yubikey or TouchID on your Chrome browser
        </h2>

        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white dark:bg-gray-900 rounded-md shadow-xl border border-gray-100 dark:border-gray-900">
          <div className="mt-8 mx-8 w-full max-w-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-[110px]">
                <LoadingSpinner className="animate-spin h-5 w-5 dark:text-gray-100 text-gray-900" />
              </div>
            ) : user ? (
              <div className="h-[110px]">
                <p className="text-left text-gray-500">
                  {`${user.username}, you are now securely logged in.`}
                </p>
                <button
                  onClick={logout}
                  className="flex items-center justify-center px-4 my-4 h-10 text-lg border border-black bg-black text-white rounded-md w-28 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-700"
                  type="submit"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <p className="text-left text-gray-500">
                  <button
                    className="underline"
                    onClick={() => setLoginVisible(false)}
                  >
                    Sign up
                  </button>
                  {' or '}
                  <button
                    className="underline"
                    onClick={() => setLoginVisible(true)}
                  >
                    log in
                  </button>
                  {' with your username below.'}
                </p>
                <form
                  className="relative my-4"
                  onSubmit={loginVisible ? login : register}
                >
                  <input
                    id="username"
                    name="username"
                    aria-label="Username"
                    placeholder="Username"
                    disabled={!isChrome}
                    required
                    className="px-3 py-3 mt-1 text-lg block w-full border border-gray-200 bg-white  dark:bg-gray-800 dark:border-gray-800 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    className="flex items-center justify-center absolute right-2 top-2 px-4 h-10 text-lg border border-black bg-black text-white rounded-md w-28 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-700"
                    type="submit"
                    disabled={!isChrome}
                  >
                    {isLoginLoading ? (
                      <LoadingSpinner className="animate-spin h-5 w-5 text-gray-100" />
                    ) : loginVisible ? (
                      'Login'
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </form>
              </>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="flex items-center my-8 w-full justify-center sm:justify-start text-black dark:text-white">
                Powered by
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://vercel.com"
                >
                  <img
                    src="/vercel.svg"
                    alt="Vercel Logo"
                    className="h-5 mx-2"
                  />
                </a>
                and
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://magic.link"
                >
                  <img src="/magic.svg" alt="Magic Logo" className="h-5 mx-2" />
                </a>
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="flex rounded focus:outline-none focus:ring focus:ring-blue-300 mb-4 sm:mb-0 min-w-max"
                href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-solutions%2Fnextjs-web-authn&project-name=magic-webauthn&repository-name=magic-webauthn&demo-title=Magic%20WebAuthn&demo-url=https%3A%2F%2Fauthn.vercel.app"
              >
                <img
                  src="https://vercel.com/button"
                  alt="Vercel Deploy Button"
                />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingSpinner({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
