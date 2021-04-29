import { Sequelize } from 'sequelize';
export class StorageService {

    private _sequelize: Sequelize;

    constructor(modelFn?: ((s: Sequelize) => void)[]) {
        this._sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'storage.db',
            logging: false // can be set to true for debugging
        });

        if (modelFn) { this.initModels(modelFn); }
        this._sequelize.sync().catch(err => console.log(err));
    }

    public initModels(modelFn: ((s: Sequelize) => void)[]) {
        modelFn.forEach(m => m(this._sequelize));
    }
}
