import { WebtoonDTO } from "../dtos/WebtoonDTO";
import { WebtoonRepository } from "../repositories/WebtoonRepository"

const webtoonRepository = WebtoonRepository.getInstance();
const resolvers = {
    Query: {
        getAllWebtoons: async () => {
            const data = await webtoonRepository.findAllWebtoonsIncludeBookmarkWithSequelize();
            return data.map(webtoon => {
                return new WebtoonDTO(
                    webtoon.get().id,
                    webtoon.get().image,
                    webtoon.get().title,
                    webtoon.get().author,
                    webtoon.get().desc,
                    webtoon.get().bookmark != null ? true : false,
                    webtoon.get().bookmark.alarm,
                    webtoon.get().bookmark.latest
                );
            });
        }
    }
};

export default resolvers;