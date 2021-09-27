export class Alert {
    constructor(
        public actual_plant: string,
        public department: string,
        public correct_plant_factory:string,
        public correct_plant_supplier: string,
        public rack: string,
        public status: string,
        public supplier: string,
        public hashrack: string,
        public _id: string
        ){}
}
