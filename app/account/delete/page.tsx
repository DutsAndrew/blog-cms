'use client';

import Link from "next/link";
import styles from '../../page.module.css';
import { useState } from "react";
import { DeleteAccountState } from "@/types/interfaces";

const DeleteAccount = () => {

  const [apiResponse, setApiResponse] = useState<DeleteAccountState>({
    message: '',
    account: '',
  });

  const handleAccountUpdateFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token) {
        makeDeleteRequest(token);
      };
    };
  };

  const makeDeleteRequest = async (token: string): Promise<void> => {
      const url = 'https://avd-blog-api.fly.dev/api/user/delete';
      const makeDeleteRequest = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const response = await makeDeleteRequest.json();
      if (response.account) {
        // account deletion was successful
        setApiResponse({
          message: response.message,
          account: response.account,
        });
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("token");
        };
        alert("You have been signed out");
      } else {
        // deletion unsuccessful
        setApiResponse({
          message: response.message,
        });
      };
  };

  return (
    <section className={styles.deleteAccountContainer}>
      <h1 className={styles.headerTitle}>Delete Account</h1>
        <Link href={'/'}>
          <button className={styles.returnButton}>
            Return to Home
          </button>
        </Link>
  
        <div className={styles.apiResponseContainer}>
          <h1 className={styles.apiHeaderText}>Database Information:</h1>
          <p className={styles.apiMessageText}>
            {apiResponse.message}
          </p>
          <p className={styles.apiAccountObject}>
            {apiResponse.account ? apiResponse.account : ""}
          </p>
        </div>

        <form 
          className={styles.deleteAccountForm}
          onSubmit={(e) => handleAccountUpdateFormSubmit(e)}
        >
          <div className={styles.formGroup}>
            <label htmlFor="deleteAccount">
              Are you sure you want to delete your account?
              <button 
                className={styles.submitButton}
                type="submit"
              >
                Yes, Delete My Account
              </button>
            </label>
          </div>
        </form>
    </section>
  );
};

export default DeleteAccount;