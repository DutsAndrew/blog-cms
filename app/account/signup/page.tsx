'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {

  const router = useRouter();

  const handleFormSubmission = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = document.querySelector('#email'),
          firstName = document.querySelector('#firstName'),
          lastName = document.querySelector('#lastName'),
          location = document.querySelector('#location'),
          password = document.querySelector('#password'),
          confirmPassword = document.querySelector('#confirmPassword');

    if (email && firstName && lastName && location && password && confirmPassword) {
      const data = new URLSearchParams();
            data.append('email', (email as HTMLInputElement).value);
            data.append('firstName', (firstName as HTMLInputElement).value);
            data.append('lastName', (lastName as HTMLInputElement).value);
            data.append('location', (location as HTMLInputElement).value);
            data.append('password', (password as HTMLInputElement).value);
            data.append('confirmPassword', (confirmPassword as HTMLInputElement).value);

      const url = 'https://avd-blog-api.fly.dev/api/signup';
      const sendFormData = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: data.toString(),
      });

      const response = await sendFormData.json();
      if (confirm(`${response.message}, email: ${response.strippedUserInformation.email}`) === true) {
        router.push('/account/login');
      } else {
        router.push('/');
      };
    };
  };

  return (
    <section className="signup-container">
      <h1 className='header-title'>Sign Up</h1>
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>
      <form 
        className='create-account-form'
        onSubmit={(e) => handleFormSubmission(e)}
      >
        <div className='form-group'>
          <label htmlFor='email'>
            *Email:
          </label>
          <input name="email" id='email' type="email"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='firstName'>
            *First Name:
          </label>
          <input name="firstName" id='firstName' type="text"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='lastName'>
            *Last Name:
          </label>
          <input name="lastName" id='lastName' type="text"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='location'>
            *Location:
          </label>
          <input name="location" id='location' type="text"></input>
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
          Create Account
        </button>
      </form>
    </section>
  );
};