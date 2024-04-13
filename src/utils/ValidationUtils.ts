/**
 * 이메일 유효성 확인
 */
function isValidEmail(email: string): boolean {
    const regex: RegExp = /\S+@\S+\.\S+/;
    return regex.test(email);
}

export { isValidEmail }