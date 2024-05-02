import { DataTypes } from "sequelize";
import { DB, DBManager } from 'configs/db';

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
            type: DataTypes.TEXT
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

const linkModel = {
    tableName: 'link',
    definition:{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
        tableName: 'link',
        freezeTableName: true,
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
            allowNull: false,
            unique: true
        },
        host: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    options: {
        tableName: 'platform',
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
        webtoonId: {
            type: DataTypes.BIGINT,
            allowNull: false
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

const genreModel = {
    tableName: 'genre',
    definition: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    options: {
        tableName: 'genre',
        freezeTableName: true,
        timestamps: false
    }
}

const webtoonGenreModel = {
    tableName: 'webtoon_genre',
    definition: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        webtoonId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        genreId: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    },
    options: {
        tableName: 'webtoon_genre',
        freezeTableName: true,
        timestamps: false
    }
}

const dbManager = DBManager.getInstance(DB.MySQL);
const sequelize = dbManager.getSequelize();

const webtoonS = sequelize.define(webtoonModel.tableName, webtoonModel.definition, webtoonModel.options);
const platformS = sequelize.define(platformModel.tableName, platformModel.definition, platformModel.options);
const bookmarkS = sequelize.define(bookmarkModel.tableName, bookmarkModel.definition, bookmarkModel.options);
const linkS = sequelize.define(linkModel.tableName, linkModel.definition, linkModel.options);
const genreS = sequelize.define(genreModel.tableName, genreModel.definition, genreModel.options);
const webtoonGenreS = sequelize.define(webtoonGenreModel.tableName, webtoonGenreModel.definition, webtoonGenreModel.options);

webtoonS.hasMany(linkS);
platformS.hasOne(linkS);
webtoonS.hasOne(bookmarkS);
webtoonS.hasMany(webtoonGenreS);
genreS.hasMany(webtoonGenreS);

linkS.belongsTo(webtoonS);
linkS.belongsTo(platformS);
bookmarkS.belongsTo(webtoonS);
webtoonGenreS.belongsTo(webtoonS);
webtoonGenreS.belongsTo(genreS);

export { webtoonS, platformS, bookmarkS, linkS, genreS, webtoonGenreS }