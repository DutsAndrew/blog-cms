import Link from 'next/link';

export default function Login() {
  return (
    <section className="login-container">
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>
    </section>
  );
};