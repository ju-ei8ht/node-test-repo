class SuccessDTO {
    private code: number;
    private message: string;

    constructor(message: string) {
        this.code = 200;
        this.message = message;
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }
}

export { SuccessDTO }