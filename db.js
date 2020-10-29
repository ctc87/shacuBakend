// db.js
var Connection = require('database-js').Connection;
// ========


var dotenv = require('dotenv');
var moment = require('moment');
moment().format(); 

dotenv.config();

function DB() {
    //this.bar = bar;
}

  
DB.prototype.userExist = async function userExist(email) {
    let conn, statement, results, registered, is_admin;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`SELECT * FROM users WHERE email = '${email}'`);
        results = await statement.query();
        if(results.length > 0) {
            registered = true;
            is_admin = results[0].is_admin; 
        } else {
            registered = false;
            is_admin = false; 
        }
        
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        //process.exit(0);
        return {'registered':registered, 'is_admin':is_admin};
    }

};

DB.prototype.itsAdmin = async function itsAdmin(email) {
    let conn, statement, results;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`SELECT * FROM users WHERE email = '${email}'`);
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        //process.exit(0);
        return (results[0].is_admin);
    }
};


DB.prototype.getUserMessages = async function getUserMessages(id) {
    let conn, statement, results;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`SELECT * FROM messages WHERE user_id = ${id}`);
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        //process.exit(0);
        return (results);
    }
};


  
  
DB.prototype.createUser = async function createUser(res, name, nick, mail) {
    let obj = await this.userExist(mail);
    if(!obj.registered) {
        let conn, statement, results;
        try {
            let values =  mail != "carlos.troyano.carmona@gmail.com" ?  `('${name}', '${nick}','${mail}')` : `('${name}', '${nick}','${mail}', true)`;
            conn = new Connection(process.env.DB_CONNECTION); // MySQL
            rows =  mail != "carlos.troyano.carmona@gmail.com" ? '(firstname, nick, email)' : '(firstname, nick, email, is_admin)';
            statement = conn.prepareStatement(`INSERT INTO users ${rows} VALUES ${values}`);
            results = await statement.query();
        } catch (reason) {
            console.log(reason);
        } finally {
            if (conn) {
                await conn.close();
            }
            //process.exit(0);
            return results;
        }
    } else {
        console.log("USuario ya registrado")
    }
};  
  
DB.prototype.insert = async function insert(res, fields_values, table)  {
    fields = "("
    values = "("
    console.log(fields_values)
    for (const property in fields_values) {
        fields += property + ",";
        values += fields_values[property].type == "number" ? fields_values[property].value + "," : "'" + fields_values[property].value + "',"
    }
    fields = fields.replace(/.$/,")");
    values = values.replace(/.$/,")");
    let conn, statement, results;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`INSERT INTO ${table} ${fields} VALUES ${values}`);
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        return results;
        //process.exit(0);
    }
    
};  
  
DB.prototype.select = async function select(res, _fields, table, where_obj = false)  {
    let where, fields  = ""
    if (where_obj) {
        where += " where "
        where += where_obj.field;
        where += " " + where_obj.condition + " ";
        where += where_obj.value.type == "string" ? "'" + where_obj.value.content + "'" : where_obj.value.content ;
    }
    for (let i = 0; i < _fields.length; i++) {
        fields += _fields[i] + ",";
    } 
    fields = fields.replace(/.$/," ");
    let conn, statement, results;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`SELECT ${fields} from  ${table} ${where}`);
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        return results;
        //process.exit(0);
    }
    
};

  
DB.prototype.update = async function update(res, _fields_values, table, where_obj = false)  {
    let where = "";
    let fields  = "";
    console.log("UPDATE IN DB")
    if (where_obj) {
        where += " where "
        where += where_obj.field;
        where += " " + where_obj.condition + " ";
        where += where_obj.value.type == "string" ? "'" + where_obj.value.content + "'" : where_obj.value.content ;
    }
    for (const property in _fields_values) {
        fields += property + " = ";
        fields += _fields_values[property].type == "number" ? _fields_values[property].value + "," : "'" + _fields_values[property].value + "',"
    } 
    fields = fields.replace(/.$/," ");
    let conn, statement, results;
    try {

        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`UPDATE ${table} SET ${fields} ${where}`);
        console.log(statement)
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        return results;
        //process.exit(0);
    }
    
};



DB.prototype.delete_ids = async function delete_ids(res, table, ids)  {
    let where = "id IN (";
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        where += id + ","   
    }
    where = where.replace(/.$/,")");
    let conn, statement, results;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`DELETE FROM ${table} WHERE ${where}`);
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        return results;
        //process.exit(0);
    }
};


  
DB.prototype.exist = async function exist(res, table, id)  {
    let conn, statement, results;
    
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`SELECT id from ${table} where id = ${id}`);
        results = await statement.query();
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        return (results.length > 0);
        //process.exit(0);
    }
    
};

 

DB.prototype.getContentQR = async function getContentQR(_ids)  {
    _ids = JSON.parse(_ids);
    let ids = "";
    let extra_fields = ""
    console.log(_ids.length, _ids)
    if(_ids.length > 0) {
        ids = " WHERE qr.id in (";
        for (let i = 0; i < _ids.length; i++) {
            const id = _ids[i];
            ids += id + ","   
        }
        ids = ids.replace(/.$/,")");

    } else {
        extra_fields = "qr.lat, qr.lon, qr.qr_name,";
    }
    let conn, statement, results;
    try {
        conn = new Connection(process.env.DB_CONNECTION); // MySQL
        statement = conn.prepareStatement(`
        SELECT qr.id, ${extra_fields} users.id, users.email, users.nick, users.firstname, content.*  
        FROM qr INNER JOIN content 
        ON qr.id = content.qr_id 
        INNER JOIN users 
        ON users.id = content.user_id 
         ${ids};
        `);
        results = await statement.query();
        console.log(results)
        results.forEach(reg => {
            let publish_date = new Date (reg.reg_date);
            let today =  new Date(); 
            let content_time = today - publish_date;
            time_to_expiration = Number(process.env.EXPIRATION_CONTENT) - content_time;
      
            if(time_to_expiration > 0) {
                reg.expired = false;
            } else {
                reg.expired = true; 
            }
            time_to_expiration = Math.abs(time_to_expiration);
            var diff = new moment.duration(time_to_expiration);
            let days =  diff.days();     // # of days in the duration
            let string_days =  days < 1 ? "": hours + ","; 
            let hours =  diff.hours();    // # of hours in the duration
            let string_hours =  hours < 10 ? "0"+hours: hours; 
            let minutes = diff.minutes();  // # of minutes in the duration
            string_minutes =  minutes < 10 ? "0"+minutes: minutes; 
            let secs = diff.seconds();  // # of seconds in the duration
            string_seconds =  secs < 10 ? "0"+secs: secs; 
            let explanation =  days < 1 ? " HH:MM:SS" : " D, HH:MM:SS"
            reg.expiration = `${string_days} ${string_hours}:${string_minutes}:${string_seconds}` + explanation;

        })
    } catch (reason) {
        console.log(reason);
    } finally {
        if (conn) {
            await conn.close();
        }
        return (results);
        //process.exit(0);
    }
    
};


module.exports = DB;


