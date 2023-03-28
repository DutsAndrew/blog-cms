import anvilSVG from '../../public/anvil.svg';
import Link from 'next/link';

export default function Header() {
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