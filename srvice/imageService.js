const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid").v4;
const path = require("path");
const fs = require("fs-extra");
const { HttpError } = require("../utils");

class ImageService {
  static imageUploadMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith("image/")) {
        cbk(null, true);
      } else {
        cbk(new HttpError(400, "Bad request, upload images only"), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single("avatar");
  }

  static async saveImg(file, options, userId) {
    if (
      file.size >
      (options?.maxFileSize
        ? options.maxFileSize * 1024 * 1024
        : 1 * 1024 * 1024)
    ) {
      throw new HttpError(400, `File's too large`);
    }

    const fileName = `${uuid()}.jpeg`;
    const tmpPath = path.join(process.cwd(), "tmp", fileName);
    const publicPath = path.join(
      process.cwd(),
      "public",
      "avatars",
      `${userId}_avatar.jpeg`
    );

    await jimp.read(file.buffer).then((image) => {
      return image.resize(250, 250).writeAsync(tmpPath);
    });

    await fs.move(tmpPath, publicPath, { overwrite: true });

    await fs.remove(path.join(process.cwd(), "tmp"));

    return `/avatars/${userId}_avatar.jpeg`;
  }
}

module.exports = ImageService;
