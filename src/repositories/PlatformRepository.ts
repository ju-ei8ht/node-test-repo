import type { Transaction } from "sequelize";
import type { RegisterDTO } from "../dtos/WebtoonDTO";
import { platformS } from "../models/sequelize";

class PlatformRepository {

    private static instance: PlatformRepository;

    private constructor() { }

    public static getInstance(): PlatformRepository {
        if (this.instance == null) this.instance = new PlatformRepository();
        return this.instance;
    }

    public async findPlatformByNameWithSequelize(name: string) {
        return await platformS.findOne({ where: { name } })
    }

    public async saveWithSequelize(data: RegisterDTO, transaction: Transaction) {
        return await platformS.create({
            image: data.getPlatform().getImage(),
            name: data.getPlatform().getName(),
            url: data.getPlatform().getUrl()
        }, { transaction });
    }
}

export { PlatformRepository }