import anvilSVG from '../../public/anvil.svg';

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
        <p className="auth-text">Sign Up</p>
        <p className="auth-text">Login</p>
      </nav>
    </section>
  );
};