import { Router } from "express";
import frontController from "../controllers/FrontController";
import { getAllWebtoons, postWebtoonAndBookmark } from "../controllers/WebtoonController";

const router = Router();

router.get("/api/webtoons", frontController(getAllWebtoons));
router.get("/api/webtoon", frontController(postWebtoonAndBookmark));

export default router;