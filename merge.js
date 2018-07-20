const fs = require('fs')

let dataFile1 = fs.readFileSync('./data/data-1000.json',"utf-8")
let dataFile2 = fs.readFileSync('./data/data-2000.json',"utf-8")
let dataFile3 = fs.readFileSync('./data/data-3000.json',"utf-8")
let dataFile4 = fs.readFileSync('./data/data-4000.json',"utf-8")
let dataFile5 = fs.readFileSync('./data/data-5000.json',"utf-8")
let dataFile6 = fs.readFileSync('./data/data-6000.json',"utf-8")
let dataFile7 = fs.readFileSync('./data/data-7000.json',"utf-8")
let dataFile8 = fs.readFileSync('./data/data-7004.json',"utf-8")

let data1 = JSON.parse(dataFile1).data
let data2 = JSON.parse(dataFile2).data
let data3 = JSON.parse(dataFile3).data
let data4 = JSON.parse(dataFile4).data
let data5 = JSON.parse(dataFile5).data
let data6 = JSON.parse(dataFile6).data
let data7 = JSON.parse(dataFile7).data
let data8 = JSON.parse(dataFile8).data

let dataAll = data1.concat(data2,data3,data4,data5,data6,data7,data8)

fs.writeFile(
	__dirname + '/data/dataAll.json',
	JSON.stringify(dataAll),
	(err) => {
		if (err) throw err;
		console.log('文件已保存!')
	}
)