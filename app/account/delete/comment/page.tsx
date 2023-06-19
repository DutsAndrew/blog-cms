'use client';

import { useEffect, useState } from "react";
import { DeleteCommentState } from "@/types/interfaces";
import styles from '../../../page.module.css';
import Link from "next/link";
import { Comment, CommentsResponse } from "@/types/interfaces";

const DeleteComment = () => {

  const [apiResponse, setApiResponse] = useState<DeleteCommentState>({
    comments: [],
    foundComments: false,
    message: '',
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token: string | null = sessionStorage.getItem("token");
      if (token) {
        fetchComments(token);
      } else {
        return;
      };
    };
  }, []);

  const fetchComments = async (token: string): Promise<void> => {
    const url: string = 'https://avd-blog-api.fly.dev/api/user/comments';
    try {
      const findComments = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const response: CommentsResponse = await findComments.json();
      if (response.comments) {
        // comments found
        setApiResponse({
          comments: response.comments ? response.comments : [],
          foundComments: true,
          message: `${response.message}`,
        });
      } else {
        // no comments found
        setApiResponse({
          comments: [],
          foundComments: false,
          message: `${response.message}`,
        });
      };
    } catch(error) {
      setApiResponse({
        comments: ["You haven't written any comments"],
        foundComments: false,
        message: "There were issues making this request",
      });
    };
  };

  const handleCommentClick = (comment: Comment): void => {
    console.log(comment);
  };

  if (apiResponse.foundComments === false || apiResponse.comments.length === 0) {
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
  } else {
    // found comments
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
  
          <div className={styles.commentsContainer}>
            {apiResponse.comments.map((comment: Comment) => {
              return <div 
                key={comment._id} 
                className={styles.commentContainer}
                onClick={() => {
                  handleCommentClick(comment);
                }}
              >
                <div className={styles.commentInformationText}>
                  <p className={styles.commentBodyText}>
                    <em>Comment: </em>{comment.comment ? comment.comment : ''}
                  </p>
                </div>
                <div className={styles.commentDateAndTime}>
                  <p className={styles.commentDateText}>
                    <em>Date: </em>{comment.comment ? comment.timestamp.split('T')[0] : ''}
                  </p>
                  <p className={styles.commentTimeText}>
                    <em>Time: </em>{comment.comment ? comment.timestamp.split('T')[1].split('.')[0]: ''}
                  </p>
                </div>
              </div>
            })}
          </div>
      </section>
    );
  };
};

export default DeleteComment;