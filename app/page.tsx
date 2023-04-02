'use client';

import styles from './page.module.css';
import uniqid from 'uniqid';
import Link from 'next/link';
import Header from './Header/Header';
import { use, useEffect, useState } from 'react';

export default function Home() {

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

  const handleNotAuthorizedCardsClick = () => {
    alert('You are not signed in and therefore cannot perform post managing actions; please create an account and or login before attempting again');
  };

  const crudOperations = [
    {
      title: "Create Post",
      route: "/post/create",
    },
    {
      title: "Update Post",
      route: "/post/update"
    },
    {
      title: "Delete Post",
      route: "/post/delete",
    },
    {
      title: "Account Management",
      route: "/account"
    },
  ];

  if (auth.token === true) {
    return (
      <>
        <Header />
        <main className={styles.cmsCardsContainer}>
          {crudOperations.map((operation) => {
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
      </>
    );
  } else {
    return (
      <>
        <Header />
        <main className={styles.cmsCardsContainer}>
          {crudOperations.map((operation) => {
            return <div 
              className={styles.notAuthorizedCards}
              key={uniqid()} 
              onClick={() => handleNotAuthorizedCardsClick()}
            >
              <p className={styles.operationText}>
                {operation.title}
              </p>
            </div>
          })}
        </main>
      </>
    );
  };
}