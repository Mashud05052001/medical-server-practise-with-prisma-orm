import fs from "fs";
import path from "path";

const clearUploadFolder = () => {
  const uploadPath = path.join(process.cwd(), "upload");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      console.error("Error reading upload folder:", err);
      return;
    }
    for (const file of files) {
      const filePath = path.join(uploadPath, file);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete file: ${file}`, err);
      });
    }
  });
};

export default clearUploadFolder;
