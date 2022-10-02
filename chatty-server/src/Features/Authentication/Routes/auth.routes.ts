import express, {Router} from 'express';
import {SignupController} from "@auth/Controllers/singup.controller";

class AuthRoutes {
    private readonly _router: Router;
    constructor() {
        this._router = express.Router();
    }

    public routes(): Router {
        this._router.post('/signup', SignupController.prototype.create);
        return this._router;
    }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
