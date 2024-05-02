import { getBookmarks } from "BookmarkService";
import { getWebtoonDetails, getWebtoons } from "WebtoonService";

const resolvers = {
    Query: {
        getAllWebtoons: async (_: any, { user, page, size }: { user: string; page: number; size: number }) => {
            return await getWebtoons(user, page, size);
        },
        getBookmarkWebtoons: async (_: any, { user, page, size }: { user: string; page: number; size: number }) => {
            return await getBookmarks(user, page, size);
        },
        getWebtoon: async (_: any, { user, id }: { user: string, id: number }) => {
            return await getWebtoonDetails(id, user);
        }
    }
};

export default resolvers;