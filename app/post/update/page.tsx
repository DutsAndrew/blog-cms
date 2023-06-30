'use client';

import { useEffect, useState } from 'react';
import styles from '../../page.module.css';
import Link from 'next/link';
import UpdatePostForm from '@/app/Components/UpdatePostForm';
import parse from 'html-react-parser';
import { 
  UserPostsResponse,
  UserPostsState,
  UpdateRequestedState,
  Post 
} from '@/types/interfaces';

export default function UpdatePost() {

  const [apiResponse, setApiResponse] = useState({
    foundPosts: false,
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
    const url: string = 'https://avd-blog-api.fly.dev/api/user/posts/all';
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
        if (response.posts) {
          // we found posts connected to the users account
          setPosts({
            list: response.posts,
          });
          setApiResponse({
            foundPosts: true,
            message: response.message,
          });
        } else {
          // no posts were connected with the account
          setPosts({
            list: ["no posts were found"],
          });
          setApiResponse({
            foundPosts: false,
            message: (response as unknown as UserPostsResponse).message,
          });
        };
      };
    } catch(error) {
      setApiResponse({
        foundPosts: false,
        message: `${error}`,
      });
    };
  };

  const handlePostClick = (post: Post): void => {
    // redirect to a form to update post send post parameter as an argument
    setUpdateRequested({
      status: true,
      post: post,
    });
  };

  const exitUpdateForm = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      findPosts(token);
    };
    setUpdateRequested({
      status: false,
      post: null,
    });
  };

  if (updateRequested.status === true) {
    if (updateRequested.post !== null) {
      return (
        <UpdatePostForm post={updateRequested.post} exitForm={exitUpdateForm} />
      );
    };
  } else if (posts.list.length !== 0 && apiResponse.foundPosts === true) {
    return (
      <section className={styles.updatePostContainer}>
        <h1 className={styles.headerTitle}>Update a Post</h1>
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
              onClick={() => {
                handlePostClick(post);
              }}
            >
              <div className={styles.postInformationText}>
                <p className={styles.postTitleText}>
                  <strong>Title: </strong>{parse(post.title.length < 50 ? post.title : post.title.slice(0, 50))}
                </p>
                <div className={styles.postBodyText}>
                  {parse(post.body.length < 50 ? post.body : post.body.slice(0, 50))}
                </div>
              </div>
              <div className={styles.postDateAndTime}>
                <p className={styles.postDateText}>
                  <em>Date: </em>{post.timestamp.split('T')[0]}
                </p>
                <p className={styles.postTimeText}>
                  <em>Time: </em>{post.timestamp.split('T')[1].split('.')[0]}
                </p>
              </div>
            </div>
          })}
        </div>
      </section>
    );
  } else {
    return (
      // return nav items but remove post containers
      <section className={styles.updatePostContainer}>
        <h1 className={styles.headerTitle}>Update a Post</h1>
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
};