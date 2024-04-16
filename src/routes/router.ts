import { Router } from "express";
import frontController from "../controllers/FrontController";
import { getAllWebtoons, getBookmarkWebtoons, postWebtoonAndBookmark } from "../controllers/WebtoonController";

const router = Router();

router.get("/api/webtoons", frontController(getAllWebtoons));
router.get("/api/bookmarks", frontController(getBookmarkWebtoons));
router.post("/api/webtoon", frontController(postWebtoonAndBookmark));

export default router;