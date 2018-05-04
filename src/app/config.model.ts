export class Config {
    constructor(
        public workFolder: string,
        public cpf: string,
        public browserType = 'firefox',
        public browserFirefoxProfile?: string,
        public browserLocation?: string
    ) {
    }

}
