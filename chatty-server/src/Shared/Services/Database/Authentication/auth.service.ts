import { IAuthDocument } from "@features/Authentication/Interfaces/auth.interface";
import {Helpers} from "@helpers/helpers";
import {AuthModel} from "@auth/Models/auth.model";

class AuthenticationService {
    public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument | null> {
        const query = {
            $or: [
                {username: Helpers.firstLetterUppercase(username)},
                {email: Helpers.lowerCase(email)}
            ]
        };
        const user: IAuthDocument = await AuthModel.findOne(query).exec() as IAuthDocument;
        return user;
    }
}

export const authenticationService: AuthenticationService = new AuthenticationService();
