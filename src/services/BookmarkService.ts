import { DBManager } from "../configs/db"
import { CreatedDTO } from "../dtos/ResponseDTO";
import { BookmarkRepository } from "../repositories/BookmarkRepository";
import { AlreadyExistsError, BadRequestError } from "../utils/ErrorUtils";
import { isValidEmail } from "../utils/ValidationUtils";

const dbManager = DBManager.getInstance();
const bookmarkRepository = BookmarkRepository.getInstance();

/**
 * 북마크 추가
 */
async function addBookmark(webtoonId: number, user: string) {
    const sequelize = dbManager.getSequelize();
    const transaction = await sequelize.transaction();

    try {
        if(!isValidEmail(user)) throw new BadRequestError('유효하지 않은 이메일입니다.');

        // 이미 북마크에 추가됐는지 확인
        let bookmark = await bookmarkRepository.findBookmarkByWebtoonIdAndUserWithSequelize(webtoonId, user);

        if(bookmark) throw new AlreadyExistsError();

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

export { addBookmark }