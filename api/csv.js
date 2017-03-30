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
	   	'value' : 'doc.res.intent'
	   },
	   {
	   	'label' : 'Entity',
	   	'value' : 'doc.res.entity'
	   }
	]

	db.list({include_docs:true}, (err, docs) => {
		let path = './temp.csv';
		let data = docs.rows;

		//refine data
		for(let d of data){
			let intents = [];
			let entities = [];
			for(let intent of d.doc.res.intents){
				intents.push(intent.intent + ":" + intent.confidence);
			}
			d.doc.res.intent = intents.join(',');
			for(let entity of d.doc.res.entities){
				entities.push(entity.entity + ":" + entity.value);

			}
			d.doc.res.entity = entities.join(',');
		}

		//convert data to csv
		let csv = json2csv({ data: data, fields: fields });

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