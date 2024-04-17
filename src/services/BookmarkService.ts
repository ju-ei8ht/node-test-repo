import { DBManager } from "configs/db"
import { CreatedDTO } from "ResponseDTO";
import { BookmarkRepository } from "BookmarkRepository";
import { AlreadyExistsError, BadRequestError } from "ErrorUtils";
import { isValidEmail } from "ValidationUtils";
import { WebtoonDTO, WebtoonsOutDTO } from "WebtoonDTO";

const dbManager = DBManager.getInstance();
const bookmarkRepository = BookmarkRepository.getInstance();

async function getBookmarks(user: string, page: number, size: number) {
    try {
        const result = await bookmarkRepository.paginateBookmarksIncludeWebtoonWithSequelize(user, page, size);
        const { data, totalPages } = result;
        const webtoons = data.map((bookmark: any) => {
            return new WebtoonDTO(
                bookmark.get().webtoon.id,
                bookmark.get().webtoon.image,
                bookmark.get().webtoon.title,
                bookmark.get().webtoon.author,
                bookmark.get().webtoon.desc,
                bookmark
            );
        });
        return new WebtoonsOutDTO(totalPages, webtoons);
    } catch (error) {
        console.error('웹툰 조회 실패:', error);
        throw error;
    }
}

/**
 * 북마크 추가
 */
async function addBookmark(webtoonId: number, user: string) {
    const sequelize = dbManager.getSequelize();
    const transaction = await sequelize.transaction();

    try {
        if (!isValidEmail(user)) throw new BadRequestError('유효하지 않은 이메일입니다.');

        // 이미 북마크에 추가됐는지 확인
        let bookmark = await bookmarkRepository.findBookmarkByWebtoonIdAndUserWithSequelize(webtoonId, user);

        if (bookmark) throw new AlreadyExistsError();

        // 북마크 추가
        bookmark = await bookmarkRepository.saveWithSequelize(webtoonId, user, transaction);

        await transaction.commit();

        return new CreatedDTO();
    } catch (error) {
        await transaction.rollback();
        console.error('북마크 추가 실패:', error);
        throw error;
    }
}

export { getBookmarks, addBookmark }