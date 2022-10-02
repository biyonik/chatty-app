import {ObjectId} from 'mongodb';
import {Request, Response} from 'express';
import {JoiValidation} from "@globals/Decorators/joi-validation.decorator";
import {SignupSchema} from "@auth/Schemas/signup.schema";
import {IAuthDocument, ISignupData} from "@auth/Interfaces/auth.interface";
import { authenticationService } from '@root/Shared/Services/Database/Authentication/auth.service';
import {BadRequestError} from "@helpers/error-handler";
import {Helpers} from "@helpers/helpers";
import {UploadApiErrorResponse, UploadApiResponse} from "cloudinary";
import {uploads} from "@helpers/cloudinary-upload";
import HTTP_STATUS from "http-status-codes";
import {USER_CREATED_SUCCESS} from "@utils/constants";


export class SignupController {

    @JoiValidation(SignupSchema)
    public async create(requestObject: Request, responseObject: Response): Promise<void> {
        const {username, password, email, avatarColor, avatarImage} = requestObject.body;
        const checkIfUserExist: IAuthDocument | null = await authenticationService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials! User is exist.');
        }
        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomInteger(12)}`;
        const authData: IAuthDocument = SignupController.prototype.signupData({
            _id: authObjectId,
            uId,
            username,
            email,
            password,
            avatarColor
        });
        const result: UploadApiResponse | UploadApiErrorResponse | undefined = await uploads(avatarImage, `${userObjectId}`, true);
        if (!result?.public_id) {
            throw new BadRequestError('File upload: Error occured while uploading. Try again later');
        }
        responseObject
            .status(HTTP_STATUS.CREATED)
            .json({
                message: USER_CREATED_SUCCESS,
                authData
            })
    }

    private signupData(data: ISignupData): IAuthDocument {
        const {_id, username, email, uId, password, avatarColor} = data;
        return {
          _id,
          uId,
          username: Helpers.firstLetterUppercase(username),
          email: Helpers.lowerCase(email),
          password,
          avatarColor,
          createdAt: new Date()
        } as IAuthDocument;
    }
}
