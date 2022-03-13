const fs = require("fs");
const path = require("path");
// const util = require("util");

// eslint-disable-next-line node/no-extraneous-require
const mkdirp = require("mkdirp");
// const getDirName = require("path").dirname;

// const writeFile = util.promisify(fs.writeFile);
async function writeAddr(addr, name, network = "localhost") {
  const deployments = {};
  deployments.address = addr;
  deployments.contractName = name;
  await writeLog(deployments, name, network);
}

async function writeAbiAddr(artifacts, addr, name, network = "localhost") {
  const deployments = {};
  deployments.address = addr;
  deployments.contractName = artifacts.contractName;
  await writeLog(deployments, name, network);

  const abis = {};
  abis.contractName = artifacts.contractName;
  abis.abi = artifacts.abi;

  const deploymentPath = path.resolve(__dirname, `../deployments/abi`);
  if (!fs.existsSync(deploymentPath)) {
    await mkdirp(deploymentPath);
  }
  fs.writeFileSync(
    `${deploymentPath}/${abis.contractName}.json`,
    JSON.stringify(abis, null, 2)
  );
}

async function writeAbis(artifacts, name, network = "localhost") {
  const deployments = {};
  deployments.address = artifacts.address;
  deployments.contractName = artifacts.contractName;
  await writeLog(deployments, name, network);

  const abis = {};
  abis.contractName = artifacts.contractName;
  abis.abi = artifacts.abi;

  const deploymentPath = path.resolve(__dirname, `../deployments/abi`);
  if (!fs.existsSync(deploymentPath)) {
    await mkdirp(deploymentPath);
  }
  fs.writeFileSync(
    `${deploymentPath}/${abis.contractName}.json`,
    JSON.stringify(abis, null, 2)
  );
}

async function writeLog(deployments, name, network = "localhost") {
  const deploymentPath = path.resolve(__dirname, `../deployments/${network}`);
  if (!fs.existsSync(deploymentPath)) {
    await mkdirp(deploymentPath);
  }
  fs.writeFileSync(
    `${deploymentPath}/${name}.json`,
    JSON.stringify(deployments, null, 2)
  );
  console.log(`Exported deployments into ${deploymentPath}`);
}

module.exports = {
  writeLog,
  writeAbis,
  writeAbiAddr,
  writeAddr,
};
