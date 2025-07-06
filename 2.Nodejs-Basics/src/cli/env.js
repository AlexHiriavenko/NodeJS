const parseEnv = () => {
  const res = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (key.startsWith("RSS_")) {
      acc += `${key}=${value}; `;
    }
    return acc;
  }, "");

  console.log(res.slice(0, -2));
  return res.slice(0, -2);
};

parseEnv();
