/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';

const json2csv = require('json2csv');
const fs = require('fs');

const cloudant = require('../util/db');
const db = cloudant.db['conversation'];

let collectQuestion = (req, res) => {
	let fields = [
	   {
	   	'label' : 'Question',
	   	'value' : 'doc.res.input.text'
	   },
	   {
	   	'label' : 'Intent',
	   	'value' : 'doc.res.intents[0].intent'
	   },
	   {
	   	'label' : 'Confidence',
	   	'value' : 'doc.res.intents[0].confidence'
	   }
	]

	db.list({include_docs:true}, (err, docs) => {
		let path = './temp.csv';
		let csv = json2csv({ data: docs.rows, fields: fields });
		fs.writeFile(path, '\ufeff'+csv, function(err) {
		  if (err) throw err;
		  else res.download(path);
		});
	});	
}

module.exports = {
    'initialize': (app, options) => {
        app.get('/csv/questions', collectQuestion);
    }
};