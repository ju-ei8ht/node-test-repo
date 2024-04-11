class MsgDTO {
    private msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    getMsg(): string {
        return this.msg;
    }
}

export { MsgDTO }