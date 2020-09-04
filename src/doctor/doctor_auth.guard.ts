import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwt from "jsonwebtoken";

@Injectable()
export class DoctorAuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context).getContext();
        console.log(ctx.headers.authorization);
        if (!ctx.headers.authorization) {
            return false;
        }
        ctx.doctor = await this.validateToken(ctx.headers.authorization);
        console.log(ctx.doctor);
        return ctx.doctor;
    }

    async validateToken(auth: string) {
        if (auth.split(' ')[0] !== 'Doctor') {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }
        const token = auth.split(' ')[1];
        try {
            return await jwt.verify(token, 'secret')
        } catch (err) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }

    // validateToken(auth: string) {
    //     if (auth.split(' ')[0] !== 'Bearer') {
    //         throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    //     }
    //     const token = auth.split(' ')[1];
    //     try {
    //         return jwt.verify(token, 'secret');
    //     } catch (err) {
    //         throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    //     }
    // }

}