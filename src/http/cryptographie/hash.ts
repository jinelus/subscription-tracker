import { compare, genSalt, hash } from "bcryptjs"


export class Hash {
    static async hashPassword(password: string) {

        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)

        return hashedPassword
    }

    static async comparePassword(password: string, hashedPassword: string) {
        return await compare(password, hashedPassword)
    }
}