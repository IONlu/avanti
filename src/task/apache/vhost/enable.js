import exec from '../../../exec.js';

export const run = async ({ hostname }) => {
    return exec('a2ensite {{hostname}}', { hostname });
};
