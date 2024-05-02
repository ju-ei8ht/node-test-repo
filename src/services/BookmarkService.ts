import { DB, DBManager } from "configs/db"
import { CreatedDTO, SuccessDTO } from "ResponseDTO";
import { BookmarkRepository } from "BookmarkRepository";
import { AlreadyExistsError, BadRequestError } from "ErrorUtils";
import { isValidEmail } from "ValidationUtils";
import { WebtoonDTO, WebtoonsOutDTO } from "WebtoonDTO";
import type { Model } from "sequelize";

const dbManager = DBManager.getInstance(DB.MySQL);
const bookmarkRepository = BookmarkRepository.getInstance();

/**
 * 북마크 조회
 */
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
                bookmark.get().webtoon.webtoon_genres,
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
async function addBookmark(webtoonId: number, user: string, flag?: Flag) {
    const sequelize = dbManager.getSequelize();
    const transaction = await sequelize.transaction();

    try {
        if (!isValidEmail(user)) throw new BadRequestError('유효하지 않은 이메일입니다.');

        // 이미 북마크에 추가됐는지 확인
        if (flag == Flag.DO || undefined) {
            const bookmark = await bookmarkRepository.findBookmarkByWebtoonIdAndUserWithSequelize(webtoonId, user);

            if (bookmark) throw new AlreadyExistsError('이미 북마크 되어 있습니다.');
        }

        // 북마크 추가
        await bookmarkRepository.saveWithSequelize(webtoonId, user, transaction);

        await transaction.commit();

        return new CreatedDTO();
    } catch (error) {
        await transaction.rollback();
        console.error('북마크 추가 실패:', error);
        throw error;
    }
}

/**
 * 북마크 업데이트 (추가 / 삭제)
 */
async function updateBookmark(status: boolean, webtoonId: number, user: string) {
    try {
        const bookmark = await bookmarkRepository.findBookmarkByWebtoonIdAndUserWithSequelize(webtoonId, user);
        if (bookmark) {
            if (status) throw new AlreadyExistsError('이미 북마크 되어 있습니다.');

            await deleteBookmark(bookmark);
        } else {
            if (!status) throw new BadRequestError('북마크 되어 있지 않습니다.');

            await addBookmark(webtoonId, user, Flag.DONT);
        }

        return new SuccessDTO();
    } catch (error) {
        console.error('북마크 업데이트 실패:', error);
        throw error;
    }
}

async function deleteBookmark(bookmark: Model) {
    const sequelize = dbManager.getSequelize();
    const transaction = await sequelize.transaction();

    try {
        await bookmarkRepository.deleteWithSequelize(bookmark);
        transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('북마크 삭제 실패:', error);
        throw error;
    }
}

enum Flag {
    DO, DONT
}
export { getBookmarks, addBookmark, updateBookmark }