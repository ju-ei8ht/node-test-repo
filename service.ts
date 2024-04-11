import { DBManager, ORM } from './config/db';
import { webtoonS } from './model/sequelize';
import { MsgDTO } from './dto';

const dbManager = DBManager.getInstance();

(async () => {
    try {
        dbManager.connect(ORM.Sequelize);
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        throw error;
    }
})();

/**
 * 모든 웹툰 조회
 */
async function allWebtoons() {
    try {
        const sequelize = dbManager.getSequelize();
        const result = await webtoonS.findAll();

        if (result == null || result.length === 0) return new MsgDTO("empty");

        return result;
    } catch (error) {
        console.error('웹툰 조회 실패:', error);
        throw error;
    }
}

export { allWebtoons }