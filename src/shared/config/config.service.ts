import { Injectable } from '@nestjs/common';

import { get } from 'config';
import { GithubAuth, GithubAuthTest } from './config.enum';

@Injectable()
export class ConfigService {
    private devEnvironment: string = process.env.NODE_ENV ? 'production' : 'development';

    /**
     * Date time format
     */
    readonly dateFormat: string = 'YYYY-MM-DD HH:mm:ss';

    /**
     * Method to return specific config variable using the constants from config.constant.ts.
     * Using this will help us get rid of: process.env.<VAR_NAME> || config.get('<var_name_path>') all over our code.
     * @param {string} name
     * @returns {string | number}
     */
    getConfigVariable(name: string): string {
        return process.env[name] || get(name);
    }

    get isDevelopment(): boolean {
        return this.devEnvironment === 'development';
    }

    get authConfig() {
        return this.isDevelopment ? GithubAuthTest : GithubAuth;
    }
}
