// Generated by CoffeeScript 2.6.1
// # Miscellaneous kerberos functions
var krb5;

module.exports = krb5 = {
  kinit: function(config) {
    var command;
    command = "kinit";
    if (config.keytab === true) {
      " -k";
    } else if (config.keytab && typeof config.keytab === 'string') {
      command += ` -kt ${config.keytab}`;
    } else if (config.password) {
      command = `echo ${config.password} | ${command}`;
    } else {
      throw Error("Incoherent config: expects one of keytab or password");
    }
    command += ` ${config.principal}`;
    return command = krb5.su(config, command);
  },
  su: function(config, command) {
    if (config.uid) {
      command = `su - ${config.uid} -c '${command}'`;
    }
    return command;
  }
};