import Link from 'next/link';

export default function AccountManagement() {
  return (
    <section className="account-management-container">
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>
    </section>
  );
};