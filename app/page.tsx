'use client';

import styles from './page.module.css';
import uniqid from 'uniqid';
import Link from 'next/link';
import Header from './Header/Header';
import { use, useEffect, useState } from 'react';

export default function Home() {

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
  )
}