'use client';

import Link from 'next/link';
import styles from '../../page.module.css';
import { createElement, useEffect, useState } from 'react';
import deleteIcon from '../../../public/delete-empty.svg';
import {
  UserPostsResponse,
  UserPostsState,
  UpdateRequestedState,
  Post,
} from '@/types/interfaces';

export default function DeletePost() {

  const [apiResponse, setApiResponse] = useState({
    message: '',
  });

  const [posts, setPosts] = useState<UserPostsState>({
    list: [],
  });

  const [updateRequested, setUpdateRequested] = useState<UpdateRequestedState>({
    status: false,
    post: null,
  });

  useEffect(() => {
    // on mount look up users posts and render them to page
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert('You cannot edit any posts if you are not logged into your account');
    } else {
      findPosts(token);
    };
  }, []);

  const findPosts = async (token: string) => {
    const url: string = 'http://localhost:8080/api/user/posts';
    try {
      const findPosts = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    
      const response = await findPosts.json();
      
      if (!response) {
        alert('we had issues finding posts in our database, please try again later');
      } else {
        if ((response as unknown as UserPostsResponse).posts) {
          // we found posts connected to the users account
          const posts: any[] = [];
          (response as unknown as UserPostsResponse).posts?.forEach((post) => {
            posts.push(post);
          });
          setPosts({
            list: posts,
          });
          setApiResponse({
            message: (response as unknown as UserPostsResponse).message,
          });
        } else {
          // no posts were connected with the account
          setPosts({
            list: ["no posts were found"],
          });
          setApiResponse({
            message: (response as unknown as UserPostsResponse).message,
          });
        };
      };
    } catch(error) {
      setApiResponse({
        message: `${error}`,
      });
    };
  };

  const handleDeletePost = async (post: Post): void => {
    const token: string | null = sessionStorage.getItem("token");
    if (token) {
      const url: string = `http://localhost:8080/api/post/delete/${post._id}`;
      try {
        const deleteRequest = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
          method: 'DELETE',
        });
        const response = await deleteRequest.json();
        setApiResponse({
          message: `${response.message}`,
        });
      } catch(error) {
        setApiResponse({
          message: `${error}`,
        });
      };
    } else {
      setApiResponse({
        message: "You do not have an active token and therefore cannot delete any posts, please log-in, or re-login if you've been active for more than an hour",
      });
    };
  };

  return (
    <section className={styles.updatePostContainer}>
      <h1 className={styles.headerTitle}>Delete a Post</h1>
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

      <div className={styles.postsContainer}>
        {posts.list.map((post) => {
          return <div 
            key={post._id} 
            className={styles.postContainer}
          >
            <div className={styles.postInformationText}>
              <p className={styles.postTitleText}>
                <strong>Title: </strong>{post.title.length < 50 ? post.title.slice(0, 50) : post.title}
              </p>
              <p className={styles.postBodyText}>
                <em>Body: </em>{post.body.length < 50 ? post.body.slice(0, 50) : post.body}
              </p>
            </div>
            <div className={styles.postDateAndTime}>
              <p className={styles.postDateText}>
                <em>Date: </em>{post.timestamp.split('T')[0]}
              </p>
              <p className={styles.postTimeText}>
                <em>Time: </em>{post.timestamp.split('T')[1].split('.')[0]}
              </p>
            </div>
            <img 
              src={deleteIcon}
              className={styles.deleteIcon}
              onClick={() => handleDeletePost(post)}>
            </img>
          </div>
        })}
      </div>
      
    </section>
  );
};