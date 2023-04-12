'use client';

import Link from "next/link";
import styles from '../../page.module.css';
import { useRouter } from 'next/navigation';
import { useState } from "react";

const ChangePassword = () => {

  const router = useRouter();

  const [apiResponse, setApiResponse] = useState({
    message: '',
  });

  const handleAccountUpdateFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const oldPassword = document.querySelector('#old-password-input-account-update'),
          newPassword = document.querySelector('#new-password-input-account-update'),
          confirmNewPassword = document.querySelector('#confirm-new-password-input-account-update');

    if (oldPassword && newPassword && confirmNewPassword) {
      // form values are present in DOM
      const oldPasswordInput = (oldPassword as HTMLInputElement).value;
      const newPasswordInput = (newPassword as HTMLInputElement).value;
      const confirmNewPasswordInput = (confirmNewPassword as HTMLInputElement).value;
      sendPasswordToDb(oldPasswordInput, newPasswordInput, confirmNewPasswordInput);
    };
  };

  const sendPasswordToDb = async (oldPass: string, newPass: string, confirmNewPass: string): Promise<void> => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const formData = new URLSearchParams();
            formData.append("oldPassword", oldPass);
            formData.append("newPassword", newPass);
            formData.append("confirmNewPassword", confirmNewPass);

      const url = 'http://localhost:8080/api/user/password';
      const sendNewPassword = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        body: formData.toString(),
      });
      const response = await sendNewPassword.json();
      setApiResponse({
        message: response.message,
      });
      alert('In order to maintain security we are signing you out, please sign in with your updated information');
      setTimeout(() => {
        // give time for user to see apiResponse message on screen before signing out
        handleSignOut();
      }, 500);
    } else {
      return;
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("token");
    router.push('/');
    alert('you have been signed out');
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
            <label htmlFor="oldPassword">
              *Old Password:
              <input 
                id="old-password-input-account-update"
                name="oldPassword" 
                type="password" >
              </input>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">
              *New password:
              <input
                id="new-password-input-account-update"
                name="newPassword"
                type="password">
              </input>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmNewPassword">
              *Confirm New Password:
              <input 
                id="confirm-new-password-input-account-update"
                name="confirmNewPassword"
                type="password">
              </input>
            </label>
          </div>

          <button 
            className={styles.accountUpdateFormBtn}
            type="submit"
          >
            Change Password
          </button>
        </form>
    </section>
  );
};

export default ChangePassword;