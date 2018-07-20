const fs = require('fs')
const excel = require('exceljs');

let dataFile = fs.readFileSync('./data/dataAll.json',"utf-8")

let data = JSON.parse(dataFile)
let length = data.length
// console.log(length)
// console.log(data[0])

let workbook = new excel.stream.xlsx.WorkbookWriter({
	filename: './data/data.xlsx'
});
let worksheet = workbook.addWorksheet('众筹');

worksheet.columns = [
	{ header: 'id', key: 'id' },
	{ header: 'name', key: 'name' },
	{ header: 'website', key: 'website' },
	{ header: 'money', key: 'money' },
	{ header: 'support', key: 'support' },
	{ header: 'percent', key: 'percent' },
	{ header: 'type', key: 'type' },
	{ header: 'district', key: 'district' },
	{ header: 'label', key: 'label' },
	{ header: 'favorite', key: 'favorite' },
	{ header: 'goal', key: 'goal' },
	{ header: 'renew', key: 'renew' },
	{ header: 'comment', key: 'comment' },
	{ header: 'video', key: 'video' },
	{ header: 'photo', key: 'photo' },
	{ header: 'text', key: 'text' },
	{ header: 'amount', key: 'amount' },
]

// 当前进度
let start_time = new Date();
let current_num = 0;
let time_monit = 400;
let temp_time = Date.now();

console.log('开始添加数据');
// 开始添加数据
for(let i in data) {
	worksheet.addRow(data[i]).commit();
	current_num = i;
	if(Date.now() - temp_time > time_monit) {
		temp_time = Date.now();
		console.log((current_num / length * 100).toFixed(2) + '%');
	}
}
console.log('添加数据完毕：', (Date.now() - start_time));
workbook.commit();

let end_time = new Date();
let duration = end_time - start_time;

console.log('用时：' + duration);
console.log("程序执行完毕");