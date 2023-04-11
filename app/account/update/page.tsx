'use client';

import Link from "next/link";
import styles from '../../page.module.css';
import { useEffect, useState } from "react";
import { AccountInformationState } from "@/types/interfaces";

const UpdateAccount = () => {

  const [apiResponse, setApiResponse] = useState<AccountInformationState>({
    accountInformation: null,
    foundAccount: false,
    message: '',
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchAccountInformation(token);
    } else {
      return;
    };
  }, []);

  const fetchAccountInformation = async (token: string): Promise<void> => {
    const url: string = 'http://localhost:8080/api/user/account';
    try {
      const findAccount = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const response = await findAccount.json();
      console.log(response);
      if (response.account) {
        // account was found and attached to response body
        setApiResponse({
          accountInformation: response.account,
          foundAccount: true,
          message: `${response.message}`,
        });
      } else {
        // api call had no errors but no user data was found
        setApiResponse({
          foundAccount: false,
          message: `${response.message}`,
        });
      }
    } catch (error) {
      setApiResponse({
        foundAccount: false,
        message: `${apiResponse.message}`,
      });
    };
  };

  return (
    <section className={styles.deleteCommentContainer}>
      <h1 className={styles.headerTitle}>Delete a comment</h1>
        <Link href={'/'}>
          <button className="return-btn">
            Return to Home
          </button>
        </Link>
  
        <div className={styles.apiResponseContainer}>
          <h1 className={styles.apiHeaderText}>Database Information:</h1>
          <p className={styles.apiMessageText}>
            {apiResponse.message}
          </p>
        </div>
    </section>
  );
};

export default UpdateAccount;