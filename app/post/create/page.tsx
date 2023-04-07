'use client';

import styles from '../../page.module.css';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import closeBox from '../../../public/close-box.svg';
import { TagType } from '@/types/interfaces';
import Filter from 'bad-words';
import uniqid from 'uniqid';
import { useRouter } from 'next/navigation';

export default function CreatePost() {

  const router = useRouter();

  const [tags, setTags] = useState<TagType>({
    list: [], 
  });

  const handleFormSubmission = (e: FormEvent): void => {
    e.preventDefault();
    
    const filter = new Filter(),
          title = document.querySelector('#title'),
          body = document.querySelector('#body');

    if (title && body) {
      const titleText = (title as HTMLInputElement).value;
      const bodyText = (body as HTMLInputElement).value;
      if ((titleText.trim().length === 0 || titleText.trim().length > 25)
        || (bodyText.trim().length === 0 || bodyText.trim().length > 10000)
      ) {
        alert('Your post is missing either a title or a text body, or your title was more than 25 characters and or your body text was more than 10,000 characters. Please fix those before resubmitting');
      } else {
        // sanitize naughty words and send it to db function
        sendPostToDb(filter.clean(titleText), filter.clean(bodyText));
      };
    } else {
      alert('something went wrong, please try again');
    };
  };

  const sendPostToDb = async (title: string, body: string): Promise<void> => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert('You can not submit a post until you are logged in to our API');
    } else {
      const data = new URLSearchParams();
          data.append('title', title);
          data.append('body', body);
          data.append('tags', tags.list.toString());

      const url: string = 'http://localhost:8080/api/post/create';
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
      console.log(response);
      if (!response) {
        alert('Your post did not upload correctly to our server, please try again later');
      } else {
        alert('Your post was successfully uploaded, we are redirecting you back to the home page');
        router.push('/');
      };
    };
  };

  const handleAddTag = () => {
    const tag = document.querySelector('#tags');
    if (tag) {
      const input = (tag as HTMLInputElement).value;
      input.trim();
      if (input.length <= 35) {
        if (tags.list.length <= 4) {
          setTags({
            list: [...tags.list, input],
          });
        } else {
          alert('You can only assign 5 tags to your post, we recommend picking the most relevant tags');
        }
      } else {
        alert('We have a max character limit of 35 characters for tags');
      };
    };
  };

  const handleRemoveTag = (index: number) => {
    const tagsRef = tags;
    const tagsArray = tagsRef.list;
    tagsArray.splice(index, 1);
    setTags({
      list: tagsArray,
    });
  };

  return (
    <section className="create-post-container">
      <h1 className={styles.headerTitle}>Create a Post</h1>
      <Link href={'/'}>
        <button className="return-btn">
          Return to Home
        </button>
      </Link>

      <form 
        className='create-post-form'
        onSubmit={(e) => handleFormSubmission(e)}
      >
        <div className='form-group'>
          <label htmlFor='title'>
            *Title:
          </label>
          <input name="title" id='title' type="text"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='body'>
            *Body:
          </label>
          <input name="body" id='body' type="text"></input>
        </div>

        <div className='form-group'>
          <label htmlFor='tags'>
            Tags:
          </label>
          <input name="tags" id='tags' type="text"></input>
          <button 
            className='add-tag-btn'
            type='button'
            onClick={() => handleAddTag()}
          >
            Add Tag
          </button>
        </div>

        <div className={styles.enteredTagsContainer}>
          {tags.list.map((tag) => {
            return <div key={uniqid()} className={styles.tagContainer}>
              <p 
                className={styles.tagText}
              >
                {tag}
              </p>
              <img 
                className={styles.tagRemove}
                src={closeBox}
                onClick={() => handleRemoveTag(tags.list.indexOf(tag))}
              ></img>
            </div>
          })}
        </div>

        <button 
          type='submit'
          className='form-submit-btn'
        >
          Submit Post
        </button>
      </form>
    </section>
  );
};