import { WebtoonDTO, WebtoonsOutDTO } from "WebtoonDTO";
import { Select, WebtoonRepository } from "WebtoonRepository"

const webtoonRepository = WebtoonRepository.getInstance();
const resolvers = {
    Query: {
        getAllWebtoons: async (_: any, { user, page, size }: { user: string; page: number; size: number }) => {
            const result = await webtoonRepository.paginateWebtoonsIncludeBookmarkWithSequelize(Select.ALL, user, page, size);
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
        },
        getBookmarkWebtoons: async (_: any, { user, page, size }: { user: string; page: number; size: number }) => {
            const result = await webtoonRepository.paginateWebtoonsIncludeBookmarkWithSequelize(Select.BOOKMARK, user, page, size);
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