export class User {
    constructor(
        public email: string,
        public password: string,
        public name?: string,
        public birth?: string,
        public company?: Boolean
    ) {}
}