import type { Response } from "express";
import type { AuthenticatedRequest } from "./middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";
import TryCatch from "./Trycatch.js";
import getBuffer from "./config/datauri.js";
import { sql } from "./config/db.js";

export const addAlbum = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "You are not admin" });
    }

    const { title, description } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file to upload",
      });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }

    const upload = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "album",
    });

    const result = await sql`
   INSERT INTO albums (title, description, thumbnill) VALUES (${title}, ${description}, ${upload.secure_url}) RETURNING *
  `;

    res.json({
      message: "Album Created",
      album: result[0],
    });
  },
);

export const addSong = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "You are not admin" });
    }

    const { title, description, album } = req.body;

    const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`;

    if (isAlbum.length == 0) {
      return res.status(404).json({
        message: "No album with this id",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No file to upload",
      });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
      folder: "songs",
      resource_type: "video",
    });

    const result = await sql`
    INSERT INTO songs (title, description, audio, album_id, thumbnill) VALUES
    (${title}, ${description}, ${cloud.secure_url}, ${album}, '')
  `;

    res.json({
      message: "Song Added",
    });
  },
);

export const addThumbnil = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "You are not admin" });
    }

    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
    if (song.length == 0) {
      return res.status(401).json({ message: "No song with this id" });
    }
    const file = req.file;
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content);
    const result = await sql`
    UPDATE songs SET thumbnill = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
  `;

    res.json({
      message: "thumbnill added",
      song: result[0],
    });
  },
);

export const deleteAlbum = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "You are not admin" });
    }

    const { id } = req.params;
    const isAlbum = await sql`SELECT * FROM albums WHERE id = ${id}`;

    if (isAlbum.length === 0) {
      res.status(404).json({
        message: "No album with this id",
      });
      return;
    }

    await sql`DELETE FROM songs WHERE album_id = ${id}`;
    await sql`DELETE FROM albums WHERE id = ${id}`;

    res.json({
      message: "Album deleted successfully",
    });
  },
);

export const deleteSong = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(401).json({ message: "You are not admin" });
    }

    const { id } = req.params;
    const isSong = await sql`SELECT * FROM songs WHERE id = ${id}`;

    if (isSong.length === 0) {
      res.status(404).json({
        message: "No song with this id",
      });
      return;
    }

    await sql`DELETE FROM  songs WHERE id = ${id}`;

    res.json({
      message: "Song deleted successfully",
    });
  },
);
