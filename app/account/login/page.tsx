'use client'

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {

  const router = useRouter();

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

      const apiResponse = await sendFormData.json();

      const token = apiResponse.token;
      sessionStorage.setItem("token", token);

      // redirect user back to home page
      if (confirm(`${apiResponse.message}, You've been logged in`) === true) {
        router.push('/');
      } else {
        sessionStorage.removeItem("token");
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