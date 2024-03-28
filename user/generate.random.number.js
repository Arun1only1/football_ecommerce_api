export const generateOtp = () => {
  return (Math.floor(Math.random() * 10000) + 1000).toString().substring(1);
};
