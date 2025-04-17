const createTokenUser = (user) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    userId: user.userId,
    role: user.role,
  };
};

export default createTokenUser;
