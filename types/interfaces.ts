interface TagType {
  list: any[],
};

interface UserPostsResponse {
  message: string,
  posts?: any[],
};

interface UserPostsState {
  list: any[],
};

export {
  type TagType,
  type UserPostsResponse,
  type UserPostsState,
}