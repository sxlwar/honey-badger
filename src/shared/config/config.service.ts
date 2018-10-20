import { Injectable } from '@nestjs/common';

import { get } from 'config';
import { GithubAuth, GithubAuthTest } from './config.enum';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
    [key: string]: string;
}

export interface GithubAuthConfig {
    clientId: string;
    clientSecret: string;
    redirect: string;
}

@Injectable()
export class ConfigService {
    readonly dateFormat: string = 'YYYY-MM-DD HH:mm:ss';

    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));

        this.envConfig = this.validateInput(config);
    }

    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid(['development', 'production', 'test', 'provision'])
                .default('development'),
            PORT: Joi.number().default(3000),
            IS_PRODUCTION: Joi.boolean().required(),
            DATABASE: Joi.string(),
            DATABASE_USER: Joi.string(),
            DATABASE_PASSWORD: Joi.string(),
            HOST: Joi.string(),
        });

        const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);

        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        return validatedEnvConfig;
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    getConfigVariable(name: string): string {
        return this.envConfig[name] || get(name);
    }

    get isDevelopment(): boolean {
        return !Boolean(this.envConfig.IS_PRODUCTION);
    }

    get authConfig(): GithubAuthConfig {
        return this.isDevelopment ? GithubAuthTest : GithubAuth;
    }
}
