import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";
import { CHATTU_TOKEN } from "../constants/config.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Chattu" })
    .then((data) => console.log(`✅ Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      console.error("❌ Database connection error:", err);
      process.exit(1);
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res
    .status(code)
    .cookie(CHATTU_TOKEN, token, cookieOptions)
    .json({
      success: true,
      user,
      message,
    });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  if (!io) return;
  const usersSocket = getSockets(users);
  if (usersSocket.length > 0) {
    io.to(usersSocket).emit(event, data);
  }
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    return results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
  } catch (err) {
    throw new Error(`Error uploading files to cloudinary: ${err.message}`);
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {
  if (!public_ids || public_ids.length === 0) return;
  try {
    await Promise.all(public_ids.map((id) => cloudinary.uploader.destroy(id)));
  } catch (err) {
    console.error("Error deleting files from cloudinary:", err);
  }
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
