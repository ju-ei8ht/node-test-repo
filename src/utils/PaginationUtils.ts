import type { Model } from "sequelize";

function setOffset(page: number, size: number) {
    return (page - 1) * size;
}

function calculateTotalPages(size: number, result: { rows: Model<any, any>[]; count: any; }) {
    // 총 페이지 수 계산
    const totalCount = result.count;
    const totalPages = Math.ceil(totalCount / size);

    // 결과와 총 페이지 수를 함께 반환
    return {
        data: result.rows,
        totalPages: totalPages
    }
}

export { setOffset, calculateTotalPages }