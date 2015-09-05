module.exports = {
	fetchSheets: fetchSheets,
	fetchRecords: fetchRecords,
}

var pg = require('pg');

var dbURL = process.env.TRAKR_DATABASE_URL;
if (!dbURL) {
	console.log('Required environment variable not set: TRAKR_DATABASE_URL');
	process.exit(1);
} 

function fetchRows(sql, callback) {
	pg.connect(dbURL, function(err, client) {
	  if (err) throw err;
	  client
	    .query(sql)
	    .on('row', function(row, result) {
	    	result.addRow(row);
	    })
	    .on('end', function(result) {
	    	callback(result);
	    });
	});
}

function fetchSheets(callback) {
	fetchRows('select * from mt_event;', function(result) {
		callback(result.rows)
	});
}

function fetchRecords(sheetId, callback) {
	// TODO: Use a prepared statement here
	fetchRows('select * from mt_money_record where event_id = ' + sheetId + ';', function(result) {
		callback(result.rows)
	});
}