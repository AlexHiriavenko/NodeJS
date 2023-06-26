import os from "os";

const write = (text) => {
  process.stdout.write(`${text}\n`);
};

const osHandler = ({ input, showInvalidInputMessage, showFailMessage }) => {
  const flag = input.split(" ")[1]?.slice(2);
  if (!flag) {
    showInvalidInputMessage();
    return;
  }
  try {
    if (flag === "EOL") {
      write(JSON.stringify(os.EOL));
    } else if (flag === "cpus") {
      const CPUData = os.cpus();
      const CPUAmount = `Total CPU amount: ${CPUData.length} \n`;
      const CPUspecificInfo = CPUData.map(
        ({ model }, index) => `CPU #${index + 1}: ${model}`
      ).join("\n");
      write(`${CPUAmount}${CPUspecificInfo}`);
    } else if (flag === "homedir") {
      write(os.homedir());
    } else if (flag === "username") {
      write(os.userInfo().username);
    } else if (flag === "architecture") {
      write(os.arch());
    } else {
      showInvalidInputMessage();
    }
  } catch (err) {
    showFailMessage();
  }
};

export default osHandler;
