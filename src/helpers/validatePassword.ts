export default function validatePassword(password: string): boolean {
    const pattern = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;

    if (pattern.test(password)) {
        return true;
    }

    return false;
}