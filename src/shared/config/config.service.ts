import { Injectable } from '@nestjs/common';

import { get } from 'config';
import { GithubAuth, GithubAuthTest, GithubAuthDev } from './config.enum';
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
            IS_TEST: Joi.boolean(),
            SENGGRID_API_KEY: Joi.string(),
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

    /**
     * Not production evn
     */
    get notProd(): boolean {
        return !Boolean(this.envConfig.IS_PRODUCTION);
    }

    /**
     * Is test env
     */
    get isTest(): boolean {
        return Boolean(this.envConfig.IS_TEST);
    }

    /**
     * Is production env
     */
    get isProd(): boolean {
        return Boolean(this.envConfig.IS_PRODUCTION);
    }

    /**
     * Is development env
     */
    get isDev(): boolean {
        return !this.isProd && !this.isTest;
    } 

    get authConfig(): GithubAuthConfig {
        if (this.notProd) {
            return this.envConfig.IS_TEST ? GithubAuthTest : GithubAuthDev;
        } else {
            return GithubAuth;
        }
    }

    get sendgridApiKey(): string {
        return this.envConfig.SENGGRID_API_KEY;
    }
}
