import { FC } from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import uniqid from 'uniqid';

const AccountOptions: FC = (): JSX.Element => {

  const accountOperation = [
    {
      title: "Update Account Information",
      route: "/account/update"
    },
    {
      title: "Change Password",
      route: "/account/password"
    },
    {
      title: "Delete Account",
      route: "/account/delete"
    },
  ];

  return (
    <div className={styles.accountOptionsContainer}>
      <div className={styles.mainPageContainer}>
        <main className={styles.cmsCardsContainer}>
          {accountOperation.map((operation) => {
            return <Link key={uniqid()} href={`${operation.route}`}>
              <div 
                className={styles.operationContainer}
              >
                <p className={styles.operationText}>
                  {operation.title}
                </p>
              </div>
            </Link>
          })}
        </main>
      </div>
    </div>
  );
};

export default AccountOptions;