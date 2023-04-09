import Link from 'next/link';
import AccountOptions from '../Components/AccountOptions';

export default function AccountManagement() {
  return (
    <section className="account-management-container">
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>

      <AccountOptions />

    </section>
  );
};