'use client'

import Link from 'next/link';
import styles from '../../page.module.css';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginState } from '@/types/interfaces';

export default function Login() {

  const router = useRouter();

  const [apiResponse, setApiResponse] = useState<LoginState>({
    message: "",
  });

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = document.querySelector('#email'),
          password = document.querySelector('#password'),
          confirmPassword = document.querySelector('#confirmPassword');

    if (email && password && confirmPassword) {
      const data = new URLSearchParams();
            data.append('email', (email as HTMLInputElement).value);
            data.append('password', (password as HTMLInputElement).value);
            data.append('confirmPassword', (confirmPassword as HTMLInputElement).value);

      const url = 'http://localhost:8080/api/login';
      const sendFormData = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: data.toString(),
      });

      const response = await sendFormData.json();

      if (response.errors) {
        setApiResponse({
          message: response.message,
          errors: apiResponse.errors,
        });
      } else if (response.token) {
        // no errors found
        const token = response.token;
        sessionStorage.setItem("token", token);
        // redirect user back to home page
        if (confirm(`${apiResponse.message} You've been logged in`) === true) {
          router.push('/');
        } else {
          sessionStorage.removeItem("token");
        };
      } else {
        return;
      };
    };
  };

  return (
    <section className="login-container">
      <h1 className='header-title'>Log In</h1>
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
        className='login-account-form'
        onSubmit={(e) => handleFormSubmission(e)}
      >
        <div className='form-group'>
          <label htmlFor='email'>
            *Email:
          </label>
          <input name="email" id='email' type="email"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='password'>
            *Password:
          </label>
          <input name="password" id='password' type="password"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='confirmPassword'>
            *Confirm Password:
          </label>
          <input name="confirmPassword" id='confirmPassword' type="password"></input>
        </div>

        <button type='submit'>
          Login
        </button>
      </form>
    </section>
  );
};