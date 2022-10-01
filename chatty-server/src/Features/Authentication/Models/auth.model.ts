import {model, Model, Schema} from "mongoose";
import {hash, compare} from 'bcryptjs';
import {IAuthDocument} from "@auth/Interfaces/auth.interface";

const SALT_ROUND = 10;

const AuthSchema: Schema = new Schema({
    username: {type: String},
    uId: {type: String},
    email: {type: String},
    password: {type: String},
    avatarColor: {type: String},
    createdAt: {type: Date, default: Date.now}
},{
    toJSON: {
        transform(_doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

AuthSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
    const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
    this.password = hashedPassword;
    next();
});

AuthSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const hashedPassword: string = (this as unknown as IAuthDocument).password! as string;
    return compare(password, hashedPassword);
}

AuthSchema.methods.hashPassword = async function (password: string): Promise<string> {
    return hash(password, SALT_ROUND);
}

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', AuthSchema, 'Auth');
export {AuthModel};
