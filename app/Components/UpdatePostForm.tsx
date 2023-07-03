'use client';

import { FC, useState, useRef, useEffect } from 'react';
import styles from '../page.module.css';
import Link from 'next/link';
import { UpdatePostProps, TagType, PostFormCommentsState, Comment } from '@/types/interfaces';
import uniqid from 'uniqid';
import closeBox from '../../public/close-box.svg';
import Filter from 'bad-words';
import { Editor } from '@tinymce/tinymce-react';

const UpdatePostForm: FC<UpdatePostProps> = (props) => {

  const { post, exitForm, handleRemoveCommentFromPostList } = props;

  const editorRef = useRef(null);

  const [tags, setTags] = useState<TagType>({
    list: [...post.tags], 
  });

  const [apiResponse, setApiResponse] = useState({
    message: '',
  });

  const [fetchedComments, setFetchedComments] = useState<PostFormCommentsState>({
    comments: [],
  });

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    // rerender change to comments
  }, [fetchedComments]);

  const fetchComments = async () => {
    const postId = post._id;
    const url = `https://avd-blog-api.fly.dev/api/post/${postId}/comments`;
    const comments = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    const response = await comments.json();
    if (response.comments) {
      // comments found
      setFetchedComments({
        comments: response.comments,
      });
    } else {
      // comments not retrieved
      setFetchedComments({
        comments: [],
      });
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

  const handleFormUpdateSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    (editorRef as any).current.getContent()
    
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
        sendPostToDbToUpdate(filter.clean(titleText), filter.clean(bodyText));
      };
    } else {
      alert('something went wrong, please try again');
    };
  };

  const sendPostToDbToUpdate = async (title: string, body: string): Promise<void> => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : false;
    if (!token) {
      alert('You can not submit a post until you are logged in to our API');
    } else {
      const data = new URLSearchParams();
          data.append('title', title);
          data.append('body', body);
          data.append('tags', tags.list.toString());

      const url: string = `https://avd-blog-api.fly.dev/api/post/update/${post._id}`;
      const sendPost = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        method: 'PUT',
        body: data.toString(),
      });

      try {
        const response = await sendPost.json();
        if (response) {
          setApiResponse({
            message: `${response.message}`,
          });
        } else {
          return;
        }
      } catch(error) {
        setApiResponse({
          message: `${error}`,
        });
      };
    };
  };

  const handleRemoveComment = async (commentId: string) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : false;
    if (!token) {
      alert('You can not submit a post until you are logged in to our API');
    } else {
      const apiURL = `https://avd-blog-api.fly.dev/api/post/${post._id}/comment/remove/${commentId}`;
      const sendComment = await fetch(apiURL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        method: 'DELETE',
      });
      const response = await sendComment.json();
      if (response.post) {
        // comment removed
        handleRemoveCommentFromPostList(post._id, commentId);

        // remove comment locally
        const commentListToChange: any[] = fetchedComments.comments;
        commentListToChange.splice(commentListToChange.indexOf(commentId), 1);
        setFetchedComments({
          comments: commentListToChange,
        });
      } else {
        alert(`${response.message}`);
      }
    };
  };

  return (
    <section className="update-post-container">
      <h1 className={styles.headerTitle}>Update a Post</h1>
      <div className='return-button-container'>
        <Link href={'/'}>
          <button className="return-btn">
            Return to Home
          </button>
        </Link>
        
        <button 
          className="return-btn"
          onClick={() => exitForm()}
        >
          Return to Update Page
        </button>
      </div>

      <div className={styles.apiResponseContainer}>
        <h1 className={styles.apiHeaderText}>Database Information:</h1>
        <p className={styles.apiMessageText}>
          {apiResponse.message}
        </p>
      </div>

      <form 
        className='create-post-form'
        onSubmit={(e) => handleFormUpdateSubmission(e)}
      >
        <div className='form-group'>
          <label htmlFor='title'>
            *Title:
          </label>
          <input
            name="title"
            id='title'
            type="text"
            defaultValue={post.title}>
          </input>
        </div>

        <div className='form-group'>
          <label htmlFor='body'>
            *Body:
          </label>
          <Editor
          apiKey={process.env.tinyMCE}
          onInit={(evt, editor) => (editorRef as any).current = editor}
          initialValue={post.body}
          tagName='body'
          id='body'
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

        <div className={styles.commentsUpdateContainer}>
          {fetchedComments.comments.map((comment) => {
            return <div key={comment._id} className={styles.commentContainer}>
              <div className={styles.commentInfoData}>
                <p className={styles.commentAuthor}>
                  <strong>{comment.author}</strong>
                </p>
                <p className={styles.commentText}>
                  {comment.comment}
                </p>
              </div>
              <img 
                src={'/delete-empty.svg'} 
                className={styles.deleteIcon}
                id={comment._id}
                onClick={(e) => handleRemoveComment(((e.target as any).id))}>
              </img>
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

export default UpdatePostForm;