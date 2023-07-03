import Link from 'next/link';
import styles from '../page.module.css';
import AccountOptions from '../Components/AccountOptions';

export default function AccountManagement() {
  return (
    <section className={styles.accountManagementContainer}>
      <Link href={'/'}>
        <button className={styles.returnButton}>
          Return to Home
        </button>
      </Link>

      <AccountOptions />

    </section>
  );
};