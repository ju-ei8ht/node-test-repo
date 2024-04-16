import { bigint, boolean, int, mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core";

const webtoonD = mysqlTable('webtoon', {
    id: serial('id').primaryKey(),
    image: varchar('image', { length: 255 }),
    title: varchar('title', { length: 255 }).notNull(),
    author: varchar('author', { length: 255 }),
    desc: text('desc')
});

const linkD = mysqlTable('link', {
    id: serial('id').primaryKey(),
    url: varchar('url', { length: 255 }).notNull().unique(),
    webtoonId: bigint('webtoon_id', {mode: 'number'}).references(() => webtoonD.id).notNull(),
    platformId: bigint('platform_id', {mode: 'number'}).references(() => platformD.id).notNull()
});

const platformD = mysqlTable('platform', {
    id: serial('id').primaryKey(),
    image: varchar('image', { length: 255 }),
    name: varchar('name', { length: 50 }).notNull().unique(),
    url: varchar('url', { length: 255 }).notNull().unique()
});

const webtoonPlatformD = mysqlTable('webtoon_platform', {
    id: serial('id').primaryKey(),
    webtoonId: bigint('webtoon_id', { mode: 'number' }).references(() => webtoonD.id).notNull(),
    platformId: bigint('platform_id', { mode: 'number' }).references(() => platformD.id).notNull()
});

const bookmarkD = mysqlTable('bookmark', {
    id: serial('id').primaryKey(),
    webtoonId: bigint('webtoon_id', { mode: 'number' }).references(() => webtoonD.id).notNull(),
    user: varchar('user', { length: 255 }).notNull(),
    alarm: boolean('alarm').default(true).notNull(),
    latest: int('latest').default(-1).notNull()
});

export { webtoonD, linkD, platformD, webtoonPlatformD, bookmarkD }