const fs = require('fs')

const baseUrl = "http://www.zhongchou.cn/browse/p"
// const baseUrl = "http://www.zhongchou.cn/browse/id-23-p"

let urls = []

for(let i = 1; i <= 292; i++) {
	let obj = {
		page: i,
		url: baseUrl + i
	}
	urls.push(obj)
}

fs.writeFile(
	__dirname + '/data/urls.json',
	JSON.stringify({
		urls: urls
	}),
	(err) => {
		if (err) throw err;
		console.log('文件已保存!')
	}
)