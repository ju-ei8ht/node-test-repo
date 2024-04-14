import { WebtoonRepository } from "../repositories/WebtoonRepository"

const webtoonRepository = WebtoonRepository.getInstance();
const resolvers = {
    Query: {
        getAllWebtoons: async () => await webtoonRepository.findAllWebtoonsWithSequelize()
    }
};

export default resolvers;