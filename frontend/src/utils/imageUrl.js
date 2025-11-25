// Get API base URL
export const getApiBaseUrl = () => {
  return (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');
};

// Helper function to get post image URL
export const getPostImageUrl = (postId) => {
  if (!postId) return null;
  return `${getApiBaseUrl()}/api/posts/${postId}/image`;
};

// Helper function to get avatar URL
export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  return `${getApiBaseUrl()}/${avatar.replace(/\\/g, '/')}`;
};
