'use client';

import Link from "next/link";
import styles from '../../page.module.css';
import { useEffect, useState } from "react";
import { AccountInformationState } from "@/types/interfaces";
import Filter from 'bad-words';
import { UpdatedAccountInformation } from "@/types/interfaces";
import { useRouter } from 'next/navigation';

const UpdateAccount = () => {

  const router = useRouter();

  const [apiResponse, setApiResponse] = useState<AccountInformationState>({
    accountInformation: null,
    foundAccount: false,
    message: '',
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token) {
        fetchAccountInformation(token);
      } else {
        return;
      };
    };
  }, []);

  const fetchAccountInformation = async (token: string): Promise<void> => {
    const url: string = 'https://avd-blog-api.fly.dev/api/user/account';
    try {
      const findAccount = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const response = await findAccount.json();
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

  const handleAccountUpdateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const email = document.querySelector('#email-input-account-update'),
          firstName = document.querySelector('#first-name-input-account-update'),
          lastName = document.querySelector('#last-name-input-account-update'),
          location = document.querySelector('#location-input-account-update');

    if (email && firstName && lastName && location) {
      // form elements exist in DOM
      if ((email as HTMLInputElement).value.length !== 0
        && (firstName as HTMLInputElement).value.length !== 0
        && (lastName as HTMLInputElement).value.length !== 0
      ) {
        // required inputs are not empty
        const scrubbedResponses: UpdatedAccountInformation = sanitizeFormResponses((email as HTMLInputElement).value,
          (firstName as HTMLInputElement).value,
          (lastName as HTMLInputElement).value,
          (location as HTMLInputElement).value,
        );
        sendFormDataToDb(scrubbedResponses);
      } else {
        alert('You cannot submit this form without a first name, last name, or email');
      };
    } else {
      return;
    };
  };

  const sanitizeFormResponses = (email: string, firstName: string, lastName: string, location: string) => {
    const filter = new Filter();
    const scrubbedEmail = filter.clean(email);
    const scrubbedFirstName = filter.clean(firstName);
    const scrubbedLastName = filter.clean(lastName);
    const scrubbedLocation = filter.clean(location);
    return {
      email: scrubbedEmail,
      firstName: scrubbedFirstName,
      lastName: scrubbedLastName,
      location: scrubbedLocation,
    };
  };

  const sendFormDataToDb = async (data: UpdatedAccountInformation): Promise<void> => {
    const formData = new URLSearchParams();
          formData.append('email', data.email);
          formData.append('firstName', data.firstName);
          formData.append('lastName', data.lastName);
          if (data.location)  formData.append('location', data.location);

    if (typeof window !== "undefined") {
      const token: string | null = sessionStorage.getItem("token");
      if (token) {
        const url: string = 'https://avd-blog-api.fly.dev/api/user/account';
        try {
          const findAccount = await fetch(url, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
          });
          const response = await findAccount.json();
          if (response.account) {
            // account was found and attached to response body
            setApiResponse({
              accountInformation: response.account,
              foundAccount: true,
              message: `${response.message}`,
            });
            alert('In order to maintain security we are signing you out, please sign in with your updated information');
            handleSignOut();
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
    };
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      router.push('/');
      alert('you have been signed out');
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

        <form 
          className={styles.accountUpdateForm}
          onSubmit={(e) => handleAccountUpdateFormSubmit(e)}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email">
              *Email:
              <input 
                id="email-input-account-update"
                name="email" 
                type="email" 
                defaultValue={apiResponse.accountInformation ? apiResponse.accountInformation.email : ''}>
              </input>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="firstName">
              *First Name:
              <input
                id="first-name-input-account-update"
                name="firstName"
                type="text"
                defaultValue={apiResponse.accountInformation ? apiResponse.accountInformation.firstName : ''}>
              </input>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">
              *Last Name:
              <input 
                id="last-name-input-account-update"
                name="lastName"
                type="text"
                defaultValue={apiResponse.accountInformation ? apiResponse.accountInformation.lastName : ''}>
              </input>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">
              Location:
              <input 
                id="location-input-account-update"
                name="location" 
                type="text" 
                defaultValue={apiResponse.accountInformation ? apiResponse.accountInformation.location : ''}>
              </input>
            </label>
          </div>

          <button 
            className={styles.accountUpdateFormBtn}
            type="submit"
          >
            Update Account
          </button>
        </form>
    </section>
  );
};

export default UpdateAccount;