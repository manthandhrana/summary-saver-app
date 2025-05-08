const axios = require("axios");
const Bookmark = require("../models/Bookmark");

exports.saveBookmark = async (req, res) => {
  const { url } = req.body;

  let title = "";
  let favicon = "";
  let summary = "";

  try {
    // Fetch page metadata (title, favicon)
    const resMeta = await axios.get(url);
    const html = resMeta.data;
    title = html.match(/<title>(.*?)<\/title>/)?.[1] || url;
    favicon = new URL("/favicon.ico", url).href;
  } catch (err) {
    console.error("Error fetching page metadata:", err.message);
    title = url;
    favicon = "";
  }

  try {
    // Fetch summary via Jina AI (GET request)
    const encodedUrl = encodeURIComponent(url);
    const jinaRes = await axios.get(`https://r.jina.ai/${encodedUrl}`);
    const rawText = jinaRes.data;

    if (typeof rawText === "string" && rawText.includes("Markdown Content:")) {
      const parts = rawText.split("Markdown Content:");
      summary = parts[1]?.trim() || "No summary available";
    } else {
      summary = "No summary available";
    }
  } catch (err) {
    console.error("Error fetching summary from Jina AI:", err.message);
    summary = "Summary generation failed";
  }

  try {
    const bookmark = await Bookmark.create({
      userId: req.user.id,
      url,
      title,
      favicon,
      summary,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    console.error("Error saving bookmark:", err.message);
    res.status(500).json({ error: "Failed to save bookmark" });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    console.error("Error fetching bookmarks:", err.message);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting bookmark:", err.message);
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
};
