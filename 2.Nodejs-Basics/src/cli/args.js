const parseArgs = () => {
  const args = process.argv.slice(2);

  const res = args.reduce((acc, next, i) => {
    if (i % 2 === 0 && next.startsWith("--")) {
      acc += `${next.replace("--", "")} is ${args[i + 1]}, `;
    }
    return acc;
  }, "");

  console.log(res.slice(0, -2));
  return res.slice(0, -2);
};
parseArgs();
