import exec from './exec.js';
import Host from './host.js';
import * as User from './helper/user.js';
import Registry from './registry.js';
import convert from './helper/convert.js';

// private functions
const createHomeFolder = async (name, home) => {
    await exec('mkdir -p {{home}}', { home });
    await exec('chown -R {{name}}:{{name}} {{home}}', { name, home });
};

// client class
class Client {
    constructor(name) {
        this.name = ''+name;
        this.hostnames = {};
        this.db = Registry.get('Database');
        this.config = Registry.get('Config');
    }

    async info() {
        let result = await this.db
            .table('client')
            .first('*')
            .where({
                client: this.name
            })
            .limit(1);
        return result;
    }

    async exists() {
        return !! await this.info();
    }

    async create() {
        if (await this.exists()) {
            return;
        }

        // find free username
        const user = await User.free(this.name,'c');
        const clientFolder = convert(this.name, '-a-z0-9_\.','c');

        const home = this.config.get('clientPath') + '/' + clientFolder;
        await User.create(user, home);
        await createHomeFolder(user, home);

        await this.db
            .table('client')
            .insert({
                client: this.name,
                user: user,
                path: home
            });
    }

    async remove() {
        const info = await this.info();
        if (!info) {
            return;
        }

        let hosts = await this.hosts();
        while (hosts.length)
        {
            let host = hosts.pop();
            await this.host(host).remove();
        }

        await User.remove(info.user, `/var/www/backup/${info.user}`);

        await this.db
            .table('client')
            .where({
                client: this.name
            })
            .delete();
    }

    host(hostname) {
        return (new Host(this, hostname));
    }

    async hosts() {
        let result = await Host.listByClient(this);
        let hosts = result.map(row => row.host);
        return hosts;
    }
}

Client.list = async () => {
    const db = Registry.get('Database');
    let result = await db
        .table('client')
        .select('*')
        .orderBy('client');
    return result;
};

Client.get = async (name) => {
    var client = new Client(name);
    if (!(await client.exists())) {
        throw new Error(`Client "${name}" does not exist`);
    }
    return client;
};

export default Client;
