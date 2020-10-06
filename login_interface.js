// db.js
var Connection = require('database-js').Connection;
// ========
module.exports = {
    foo: function (res) {
        (async function() {
            let conn, statement, results;
            try {
                conn = new Connection("mysql://root:Cloud87?@localhost:3306/shacu"); // MySQL
                statement = conn.prepareStatement("SELECT * FROM users WHERE firstname = ?");
                results = await statement.query("John");
                console.log(results);
                res.json(results);
            } catch (reason) {
                console.log(reason);
            } finally {
                if (conn) {
                    await conn.close();
                }
                //process.exit(0);
            }
        })();
      
    },
    bar: function () {
      // whatever
    }
  };
  
  var zemba = function () {
  }