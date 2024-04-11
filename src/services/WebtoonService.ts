import { DBManager, ORM } from '../configs/db';
import { webtoonS } from '../models/sequelize';

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
        return await webtoonS.findAll();
    } catch (error) {
        console.error('웹툰 조회 실패:', error);
        throw error;
    }
}

export { allWebtoons }