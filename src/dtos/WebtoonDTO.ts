import type { Model } from "sequelize";

class RegisterDTO {
    private webtoon: WebtoonDTO;
    private platform: PlatformDTO;

    constructor(webtoon: WebtoonDTO, platform: PlatformDTO) {
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

class PlatformDTO {
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
    private platform: PlatformDTO;
    private title: string;
    private author: string;

    constructor(platform: PlatformDTO, title: string, author: string) {
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

export { RegisterDTO, WebtoonDTO, PlatformDTO, MetadataDTO }