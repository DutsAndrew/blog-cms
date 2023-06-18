'use client';

import styles from './page.module.css';
import uniqid from 'uniqid';
import Link from 'next/link';
import Header from './Components/Header';
import { useEffect, useState } from 'react';

export default function Home() {

  const [auth, setAuth] = useState({
    token: false,
  });

  const [crudOperations, setCrudOperations] = useState(
    [
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
    ],
  );

  useEffect(() => {
    // on header mount check for token and then display the correct header
    checkForToken();
    checkIfAdmin();
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

  const checkIfAdmin = () => {
    if (typeof window !== "undefined") {
      const role = sessionStorage.getItem("role");
      const announcementOperation = {
        title: "Create Announcement",
        route: "/announcement"
      };
      if (role === 'admin') {
        setCrudOperations(
          [...crudOperations, announcementOperation],
        );
      } else {
        return;
      };
    };
  };

  if (auth.token === true) {
    return (
      <div className={styles.mainPageContainer}>
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
      </div>
    );
  } else {
    return (
      <div className={styles.mainPageContainer}>
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
      </div>
    );
  };
};