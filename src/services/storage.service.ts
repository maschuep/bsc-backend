import { Sequelize } from 'sequelize';
export class StorageService {

    constructor() {
        this._sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'storage.db',
            logging: false // can be set to true for debugging
        });

        this._sequelize.sync().catch(err => console.log(err));
    }

    private _sequelize: Sequelize;

    public static create(modelFn?: ((sequelize: Sequelize) => void)[]) {
        const s = new StorageService();
        if (modelFn) { s.initModels(modelFn); }
        return new StorageService();
    }

    initModels(modelFn: ((sequelize: Sequelize) => void)[]) {
        modelFn.forEach(m => m(this._sequelize));
    }
}
