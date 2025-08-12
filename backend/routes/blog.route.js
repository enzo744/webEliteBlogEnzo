import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog,
  getSingleBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();
router.route("/").post(isAuthenticated, createBlog);
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs);

router.route("/:blogId").put(isAuthenticated, singleUpload, updateBlog);
router.route("/get-published-blogs").get(getPublishedBlog);

// router.patch("/:blogId/publish", isAuthenticated, togglePublishBlog);
router.route("/:blogId/publish").patch(isAuthenticated, togglePublishBlog);

router.route("/:blogId").get(isAuthenticated, getSingleBlog)

router.route("/get-all-blogs").get(getAllBlogs);
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);
router.get("/:id/like", isAuthenticated, likeBlog);
router.get("/:id/dislike", isAuthenticated, dislikeBlog);
router.get("/my-blogs/likes", isAuthenticated, getMyTotalBlogLikes);

export default router;
