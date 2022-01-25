// Generated by CoffeeScript 2.6.1
var utils;

utils = require('@nikitajs/core/lib/utils');

module.exports = {
  ...utils,
  options: ['api-cors-header', 'bridge', 'bip', 'debug', 'daemon', 'default-gateway', 'default-gateway-v6', 'default-ulimit', 'dns', 'dns-search', 'exec-driver', 'exec-opt', 'exec-root', 'fixed-cidr', 'fixed-cidr-v6', 'group', 'graph', 'host', 'help', 'icc', 'insecure-registry', 'ip', 'ip-forward', 'ip-masq', 'iptables', 'ipv6', 'log-level', 'label', 'log-driver', 'log-opt', 'mtu', 'pidfile', 'registry-mirror', 'storage-driver', 'selinux-enabled', 'storage-opt', 'tls', 'tlscacert', 'tlscert', 'tlskey', 'tlsverify', 'userland-proxy', 'version'],
  compose_options: [
    'file',
    'project-name',
    'verbose',
    'no-ansi',
    'version',
    'host',
    // TLS
    'tls',
    'tlscacert',
    'tlscert',
    'tlskey',
    'tlsverify',
    'skip-hostname-check',
    'project-directory'
  ],
  opts: function(config) {
    var option, opts, value;
    opts = (function() {
      var i, len, ref, results;
      ref = module.exports[!config.compose ? 'options' : 'compose_options'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        value = config[option];
        if (value == null) {
          continue;
        }
        if (value === true) {
          value = 'true';
        }
        if (value === false) {
          value = 'false';
        }
        if (option === 'tlsverify') {
          results.push(`--${option}`);
        } else {
          results.push(`--${option}=${value}`);
        }
      }
      return results;
    })();
    return opts.join(' ');
  },
  /*
  Build the docker command
  Accepted options are referenced in "module.exports.options". Also accept
  "machine" and "boot2docker".
  `compose` option allow to wrap the command for docker-compose instead of docker
  */
  wrap: function(config, command) {
    var docker, exe, opts;
    docker = {};
    opts = module.exports.opts(config);
    exe = config.compose ? 'bin_compose' : 'bin_docker';
    return `export SHELL=/bin/bash
export PATH=/opt/local/bin/:/opt/local/sbin/:/usr/local/bin/:/usr/local/sbin/:$PATH
bin_boot2docker=$(command -v boot2docker)
bin_docker=$(command -v docker)
bin_machine=$(command -v docker-machine)
bin_compose=$(command -v docker-compose)
machine='${config.machine || ''}'
boot2docker='${config.boot2docker ? '1' : ''}'
docker=''
if [[ $machine != '' ]] && [ $bin_machine ]; then
  if [ -z "${config.machine || ''}" ]; then exit 5; fi
  if docker-machine status "\${machine}" | egrep 'Stopped|Saved'; then
    docker-machine start "\${machine}";
  fi
  #docker="eval \\$(\\\${bin_machine} env \${machine}) && $${exe}"
  eval "$(\${bin_machine} env \${machine})"
elif [[ $boot2docker != '1' ]] && [  $bin_boot2docker ]; then
  #docker="eval \\$(\\\${bin_boot2docker} shellinit) && $${exe}"
  eval "$(\${bin_boot2docker} shellinit)"
fi
$${exe} ${opts} ${command}`;
  }
};

// wrap_schema:
//   'boot2docker':
//     type: 'boolean'
//     default: false
//     description: '''
//     Whether to use boot2docker or not.
//     '''
//   'compose':
//     type: 'boolean'
//     description: '''
//     Use the `docker-compose` command instead of `docker`.
//     '''
//   'machine':
//     type: 'string'
//     description: '''
//     Name of the docker-machine, required if using docker-machine.
//     '''
// Reformat error message if any
// TODO: rename this function as format_error