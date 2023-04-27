'use client';

import React, { useRef } from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Filter from 'bad-words';
import { useRouter } from 'next/navigation';
import { Editor } from '@tinymce/tinymce-react';

export default function Announcement() {

  console.log(sessionStorage.getItem("role"));

  // variables for component use
  const editorRef = useRef(null);

  const [apiResponse, setApiResponse] = useState({
    message: '',
  });

  const handleFormSubmission = (e: FormEvent): void => {
    e.preventDefault();

    (editorRef as any).current.getContent()

    const filter = new Filter(),
          announcement = document.querySelector('#announcement');


    if (announcement) {
      const announcementText = (announcement as HTMLInputElement).value;
      sendPostToDb(filter.clean(announcementText));
    };
  };

  const sendPostToDb = async (announcement: string): Promise<void> => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert('You can not submit a post until you are logged in to our API');
    } else {
      const data = new URLSearchParams();
          data.append('announcement', announcement);

      const url: string = 'http://localhost:8080/api/announcement/create';
      const sendPost = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        method: 'POST',
        body: data.toString(),
      });

      const response = await sendPost.json();
      if (response.announcement) {
        // announcement created
        setApiResponse({
          message: response.message,
        });
      } else {
        setApiResponse({
          message: response.message,
        });
      };
    };
  };

  return (
    <section className="create-post-container">
      <h1 className={styles.headerTitle}>Create an Announcement</h1>
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
        className='create-post-form'
        onSubmit={(e) => handleFormSubmission(e)}
      >
        <label htmlFor='announcement'>
          *Announcement:
        </label>
        <Editor
          apiKey={process.env.tinyMCE}
          onInit={(evt, editor) => (editorRef as any).current = editor}
          initialValue="<p>Write something interesting.</p>"
          tagName='announcement'
          id='announcement'
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />

        <button 
          type='submit'
          className='form-submit-btn'
        >
          Submit Announcement
        </button>
      </form>
    </section>
  );
};