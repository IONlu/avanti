var exec = require('./exec.js');

// private functions

function createHomeFolder(name) {
    return exec('mkdir -p /var/www/{{name}}', {name: name})
        .then(function() {
            return exec('chown -R {{name}}:{{name}} /var/www/{{name}}', {name: name});
        });
}

function createBackupFolder(name) {
    return exec('mkdir -p /var/backup-www/{{name}}', {name: name});
}

function removeHomeFolder(name) {
    return exec('rm -fr /var/www/{{name}}', {name: name});
}

// customer class

var Customer = function(name) {
    this.name = name;
    this.hostnames = {};
}

Customer.prototype.create = function() {
    return exec('useradd --home-dir /var/www/{{name}} --shell /bin/false {{name}}', {name: this.name})
        .then(createHomeFolder.bind(this, this.name));
}

Customer.prototype.remove = function() {
    var _t = this;
    return createBackupFolder()

    // generate a compressed backup of the customer's home folder and then remove the home folder
    .then(function() {
        return exec('deluser --backup --backup-to /var/www/backup --remove-home {{name}}', {name: _t.name});
    })

    // for some reason, the '--remove-home' command is not working properly, so we have to delete the home folder "manually"
    .then(removeHomeFolder.bind(this, this.name));
}

module.exports = Customer;
