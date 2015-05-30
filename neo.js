var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo-2.ironbay.digital');

module.exports = db;