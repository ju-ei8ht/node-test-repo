import { DataTypes } from "sequelize";
import { DBManager } from '../configs/db';

const webtoonModel = {
    tableName: 'webtoon',
    definition: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING
        },
        desc: {
            type: DataTypes.TEXT('tiny')
        }
    },
    options: {
        // 이미 존재하는 테이블의 이름 지정
        tableName: 'webtoon',
        // 모델과 데이터베이스의 형식이 일치하는지 확인하지 않음
        freezeTableName: true,
        // timestamps 옵션을 false로 설정하여 createdAt 및 updatedAt 필드 생성하지 않음
        timestamps: false
    }
};

const platformModel = {
    tableName: 'platform',
    definition:{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    options: {
        tableName: 'platform',
        freezeTableName: true,
        timestamps: false
    }
};

const webtoonPlatformModel = {
    tableName: 'webtoon_platform',
    definition:{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        webtoonId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        platformId: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    },
    options: {
        tableName: 'webtoon_platform',
        freezeTableName: true,
        timestamps: false
    }
};

const bookmarkModel = {
    tableName: 'bookmark',
    definition: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alarm: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true            
        },
        latest: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        }
    },
    options: {
        tableName: 'bookmark',
        freezeTableName: true,
        timestamps: false
    }
};

const dbManager = DBManager.getInstance();
const sequelize = dbManager.getSequelize();

const webtoonS = sequelize.define(webtoonModel.tableName, webtoonModel.definition, webtoonModel.options);
const webtoonPlatformS = sequelize.define(webtoonPlatformModel.tableName, webtoonPlatformModel.definition, webtoonPlatformModel.options);
const platformS = sequelize.define(platformModel.tableName, platformModel.definition, platformModel.options);
const bookmarkS = sequelize.define(bookmarkModel.tableName, bookmarkModel.definition, bookmarkModel.options);

webtoonS.hasMany(webtoonPlatformS);
platformS.hasMany(webtoonPlatformS);

webtoonPlatformS.belongsTo(webtoonS);
webtoonPlatformS.belongsTo(platformS)

export { webtoonS, platformS, webtoonPlatformS, bookmarkS }