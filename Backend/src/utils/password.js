import bcrypt from 'bcrypt'
import 'dotenv/config'

export async function hashPassword(pass){
    const plain = pass;
    const salt = process.env.SALT

    const hashed = bcrypt.hash(pass,salt);
    return hashed;
}

export async function comparePassword(initialPass , hashedPass){
    const result = bcrypt.compare(initialPass,hashedPass);
    return result;
}