import { WebtoonDTO, WebtoonsOutDTO } from "../dtos/WebtoonDTO";
import { WebtoonRepository } from "../repositories/WebtoonRepository"

const webtoonRepository = WebtoonRepository.getInstance();
const resolvers = {
    Query: {
        getAllWebtoons: async (_: any, { user, pageNumber, pageSize }: { user: string; pageNumber: number; pageSize: number }) => {
            const result = await webtoonRepository.paginateAllWebtoonsIncludeBookmarkWithSequelize(user, pageNumber, pageSize);
            const { data, totalPages } = result;
            const webtoons = data.map((webtoon: any) => {
                return new WebtoonDTO(
                    webtoon.get().id,
                    webtoon.get().image,
                    webtoon.get().title,
                    webtoon.get().author,
                    webtoon.get().desc,
                    webtoon.get().bookmark
                );
            });
            return new WebtoonsOutDTO(totalPages, webtoons);
        }
    }
};

export default resolvers;