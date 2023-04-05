'use client';

import { useEffect, useState } from 'react';
import anvilSVG from '../../public/anvil.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {

  const router = useRouter();

  const [auth, setAuth] = useState({
    token: false,
  });

  useEffect(() => {
    // on header mount check for token and then display the correct header
    checkForToken();
  }, []);

  const checkForToken = () => {
    const token = typeof window !== 'undefined' ? window.sessionStorage.getItem("token") : false;
    if (token) {
      setAuth({
        token: true,
      });
    } else {
      setAuth({
        token: false,
      });
    };
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    checkForToken();
    router.push('/');
    alert('you have been signed out');
  };

  if (auth.token) {
    return (
      <section className="header-container">
      <div className="header-logo-container">
        <img 
          className="anvil-svg"
          src={anvilSVG}
          >
        </img>
        <h1>
          Blog CMS
        </h1>
      </div>
      <nav className="header-nav">
        <a 
          onClick={() => handleSignOut()}
          className="auth-text">
            Sign Out
        </a>
      </nav>
    </section>
    );
  } else {
    return (
      <section className="header-container">
        <div className="header-logo-container">
          <img 
            className="anvil-svg"
            src={anvilSVG}
            >
          </img>
          <h1>
            Blog CMS
          </h1>
        </div>
        <nav className="header-nav">
          <Link href={`/account/signup`}>
            <p className="auth-text">Sign Up</p>
          </Link>
          <Link href={`/account/login`}>
            <p className="auth-text">Login</p>
          </Link>
        </nav>
      </section>
    );
  };
};

export default Header;