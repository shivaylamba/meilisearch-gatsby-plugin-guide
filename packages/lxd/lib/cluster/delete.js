// Generated by CoffeeScript 2.6.1
// # `nikita.lxc.cluster.delete`

// Delete a cluster of LXD instances.

// ## Example

// ```yaml
// networks:
//   lxdbr0public: {}
//   lxdbr1private: {}
// containers:
//   nikita:
//     image: "images:centos/7"
// predelete: path/to/action
// ```

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'containers': {
        $ref: 'module://@nikitajs/lxd/lib/cluster#/definitions/config/properties/containers'
      },
      'networks': {
        type: 'object',
        default: {},
        patternProperties: {
          '.*': {
            $ref: 'module://@nikitajs/lxd/lib/network#/definitions/config/properties/properties'
          }
        }
      },
      'force': {
        type: 'boolean',
        default: false,
        description: `If true, the containers will be deleted even if running.`
      },
      'pre_delete': {
        typeof: 'function'
      }
    },
    required: ['containers']
  }
};

// ## Handler
handler = async function({config}) {
  var containerConfig, containerName, networkConfig, networkName, ref, ref1;
  if (!!config.pre_delete) {
    await this.call(config, config.pre_delete);
  }
  ref = config.containers;
  // Delete containers
  for (containerName in ref) {
    containerConfig = ref[containerName];
    await this.lxc.delete({
      $header: `Container ${containerName} : delete`,
      container: containerName,
      force: config.force
    });
  }
  ref1 = config.networks;
  for (networkName in ref1) {
    networkConfig = ref1[networkName];
    await this.lxc.network.delete({
      $header: `Network ${networkName} : delete`,
      network: networkName
    });
  }
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};
