import type { Model } from "sequelize";

class WebtoonDetailsDTO {
    private webtoon: WebtoonDTO;
    private links: PlatformDTO[];

    constructor(webtoon: WebtoonDTO, platforms: PlatformDTO[]) {
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

class WebtoonsOutDTO {
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
    private platform: PlatformDTO;
    private genres: GenreDTO[];

    constructor(webtoon: WebtoonDTO, platform: PlatformDTO, genres: GenreDTO[]) {
        this.webtoon = webtoon;
        this.platform = platform;
        this.genres = genres;
    }

    getWebtoon() {
        return this.webtoon;
    }

    getPlatform() {
        return this.platform;
    }

    getGenres() {
        return this.genres;
    }
}

class WebtoonDTO {
    private id: number;
    private image: string;
    private title: string;
    private author: string;
    private genre: string[];
    private desc: string;
    private isBookmark: boolean;
    private isAlarm: boolean;
    private latest: number;

    constructor(id: number, image: string, title: string, author: string, genres: GenreDTO[] | Model[], desc: string, bookmark?: Model<any, any>) {
        this.id = id;
        this.image = image;
        this.title = title;
        this.author = author;
        if (genres[0] instanceof GenreDTO) this.genre = genres.map(genre => (genre as GenreDTO).getName());
        else this.genre = genres.map((data: any) => {
            const { genre } = data;
            return genre.name
        });
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

    getGenre() {
        return this.genre;
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

class GenreDTO {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

class MetadataDTO {
    private platform: PlatformDTO;
    private title: string;
    private author: string;
    private genres: GenreDTO[];

    constructor(platform: PlatformDTO, title: string, author: string, genres: GenreDTO[]) {
        this.platform = platform;
        this.title = title;
        this.author = author;
        this.genres = genres;
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

    getGenres() {
        return this.genres;
    }
}

export { WebtoonDetailsDTO, WebtoonsOutDTO, RegisterDTO, WebtoonDTO, PlatformDTO, GenreDTO, MetadataDTO }