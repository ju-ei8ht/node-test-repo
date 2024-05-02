import { Router } from "express";
import frontController from "FrontController";
import { getAllWebtoons, getBookmarkWebtoons, getWebtoon, postWebtoonAndBookmark } from "WebtoonController";

const router = Router();

router.get("/api/webtoons", frontController(getAllWebtoons));
router.get("/api/bookmarks", frontController(getBookmarkWebtoons));
router.get("/api/webtoon/:id", frontController(getWebtoon));
router.post("/api/webtoon", frontController(postWebtoonAndBookmark));

export default router;