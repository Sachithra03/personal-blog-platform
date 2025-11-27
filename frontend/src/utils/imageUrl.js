// Get API base URL
export const getApiBaseUrl = () => {
  return (process.env.REACT_APP_API_URL || 'http://localhost:5001/api').replace('/api', '');
};

// Helper function to get post image URL
export const getPostImageUrl = (postId) => {
  if (!postId) return null;
  return `${getApiBaseUrl()}/api/posts/${postId}/image`;
};

// Helper function to get avatar URL
export const getAvatarUrl = (user) => {
  if (!user) return null;
  
  // If user has avatar data, use the avatar endpoint
  if (user.avatar && user.avatar.data) {
    // Add timestamp to bust cache when avatar changes
    const timestamp = user.updatedAt || Date.now();
    return `${getApiBaseUrl()}/api/auth/avatar/${user._id || user.id}?t=${timestamp}`;
  }
  
  // If avatar is a URL string (old format)
  if (typeof user.avatar === 'string' && user.avatar.startsWith('http')) {
    return user.avatar;
  }
  
  // No avatar
  return null;
};
