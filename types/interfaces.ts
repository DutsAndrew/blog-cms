interface TagType {
  list: any[],
};

interface UserPostsResponse {
  message: string,
  posts?: any[],
};

interface CommentsResponse {
  message: string,
  comments?: any[],
};

interface UserPostsState {
  list: any[],
};

interface UpdatePostProps {
  post: {
    author: string,
    body: string;
    comments: any[];
    favorites: number;
    likes: number;
    tags: string[];
    timestamp: string;
    title: string;
    whoLiked: string[];
    _id: string,
  },
  exitForm: Function,
};

interface UpdateRequestedState {
  status: boolean,
  post: {
    author: string,
    body: string;
    comments: any[];
    favorites: number;
    likes: number;
    tags: string[];
    timestamp: string;
    title: string;
    whoLiked: string[];
    _id: string,
  } | null,
};

interface Post {
  author: string,
  body: string;
  comments: any[];
  favorites: number;
  likes: number;
  tags: string[];
  timestamp: string;
  title: string;
  whoLiked: string[];
  _id: string,
};

interface Comment {
  author: string,
  comment: string,
  likes: number,
  timestamp: string,
  _id: string,
};

interface DeleteCommentState {
  comments: any[],
  foundComments: boolean,
  message: string,
};

export {
  type TagType,
  type UserPostsResponse,
  type CommentsResponse,
  type UserPostsState,
  type UpdatePostProps,
  type UpdateRequestedState,
  type Post,
  type Comment,
  type DeleteCommentState,
}