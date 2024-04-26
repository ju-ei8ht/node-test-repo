import type { Model } from "sequelize";

class WebtoonDetailsDTO{
    private webtoon: WebtoonDTO;
    private links: LinkDTO[];

    constructor(webtoon: WebtoonDTO, platforms: LinkDTO[]) {
        this.webtoon = webtoon;
        this.links = platforms;
    }

    getWebtoon() {
        return this.webtoon;
    }

    getLinks() {
        return this.links;
    }
}

class WebtoonsOutDTO{
    private totalPages: number;
    private webtoons: WebtoonDTO;

    constructor(totalPages: number, webtoons: WebtoonDTO) {
        this.totalPages = totalPages;
        this.webtoons = webtoons;
    }

    getTotalPages() {
        return this.totalPages;
    }

    getWebtoons() {
        return this.webtoons;
    }
}

class RegisterDTO {
    private webtoon: WebtoonDTO;
    private platform: LinkDTO;

    constructor(webtoon: WebtoonDTO, platform: LinkDTO) {
        this.webtoon = webtoon;
        this.platform = platform;
    }

    getWebtoon() {
        return this.webtoon;
    }

    getPlatform() {
        return this.platform;
    }
}

class WebtoonDTO {
    private id: number;
    private image: string;
    private title: string;
    private author: string;
    private desc: string;
    private isBookmark: boolean;
    private isAlarm: boolean;
    private latest: number;

    constructor(id: number, image: string, title: string, author: string, desc: string, bookmark?: Model<any, any>) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.author = author;
        this.desc = desc;
        this.isBookmark = bookmark != null;
        this.isAlarm = bookmark == null ? false : bookmark.get().alarm;
        this.latest = bookmark == null ? -1 : bookmark.get().latest;
    }

    getId() {
        return this.id;
    }

    getImage() {
        return this.image;
    }

    getTitle() {
        return this.title;
    }

    getAuthor() {
        return this.author;
    }

    getDesc() {
        return this.desc;
    }

    getBookmark() {
        return this.isBookmark;
    }

    getAlarm() {
        return this.isAlarm;
    }

    getLatest() {
        return this.latest;
    }
}

class LinkDTO {
    private image: string;
    private name: string;
    private url: string;

    constructor(image: string, name: string, url: string) {
        this.image = image;
        this.name = name;
        this.url = url;
    }

    getImage() {
        return this.image;
    }

    getName() {
        return this.name;
    }

    getUrl() {
        return this.url;
    }
}

class MetadataDTO {
    private platform: LinkDTO;
    private title: string;
    private author: string;

    constructor(platform: LinkDTO, title: string, author: string) {
        this.platform = platform;
        this.title = title;
        this.author = author;
    }

    getPlatform() {
        return this.platform;
    }

    getTitle() {
        return this.title;
    }

    getAuthor() {
        return this.author;
    }
}

export { WebtoonDetailsDTO, WebtoonsOutDTO, RegisterDTO, WebtoonDTO, LinkDTO, MetadataDTO }