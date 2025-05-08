const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { saveBookmark, getBookmarks, deleteBookmark } = require("../controllers/bookmarkController");

router.post("/", auth, saveBookmark);
router.get("/", auth, getBookmarks);
router.delete("/:id", auth, deleteBookmark);

module.exports = router;
