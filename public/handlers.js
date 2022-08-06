exports.connect = async (client, config) => {
  try {
    await client.connect(config);
  } catch (err) {
    console.error(err);
  }
};

exports.disconnect = async (client) => {
  await client.end();
};

exports.listFiles = async (client, path) => {
  let res;
  try {
    res = await client.list(path);
  } catch (err) {
    console.error(err);
  }

  return res;
};

exports.getStats = async (client, path) => {
  let res;
  try {
    res = await client.stat(path);
  } catch (err) {
    console.error(err);
  }

  return res;
};

exports.uploadFile = async (client, targetPath, dstPath) => {
  try {
    await client.put(targetPath, dstPath);
  } catch (err) {
    console.error(err);
  }
};

exports.getFile = async (client, targetPath, dstPath) => {
  try {
    await client.get(targetPath, dstPath);
  } catch (err) {
    console.error(err);
  }
};

exports.uploadDirectory = async (client, targetPath, dstPath) => {
  try {
    await client.uploadDir(targetPath, dstPath);
  } catch (err) {
    console.error(err);
  }
};

exports.getDirectory = async (client, targetPath, dstPath) => {
  try {
    await client.downloadDir(targetPath, dstPath);
  } catch (err) {
    console.error(err);
  }
};

exports.deleteFile = async (client, path) => {
  try {
    await client.delete(path);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteDirectory = async (client, path) => {
  try {
    await client.rmdir(path, true);
  } catch (err) {
    console.error(err);
  }
};

exports.createDirectory = async (client, path) => {
  try {
    await client.mkdir(path, true);
  } catch (err) {
    console.error(err);
  }
};
