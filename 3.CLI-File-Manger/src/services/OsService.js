import os from "os";

export class OsService {
  getEOL() {
    return JSON.stringify(os.EOL); // escape for display
  }

  getCPUs() {
    const cpus = os.cpus();
    return {
      count: cpus.length,
      details: cpus.map(({ model, speed }) => ({
        model,
        speedGHz: (speed / 1000).toFixed(2),
      })),
    };
  }

  getHomeDir() {
    return os.homedir();
  }

  getUsername() {
    return os.userInfo().username;
  }

  getArchitecture() {
    return os.arch();
  }
}

export default OsService;
