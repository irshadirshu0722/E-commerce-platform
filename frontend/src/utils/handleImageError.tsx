export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null; // To prevent infinite loop in case of another error
  target.src =
    "http://res.cloudinary.com/dg3m2vvvs/image/upload/v1710835028/vtsipjaola9uaeldow5b.jpg";
};
