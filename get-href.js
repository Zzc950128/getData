const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')

let urlsFile = fs.readFileSync(__dirname + '/data/urls.json',"utf-8")
let urls = JSON.parse(urlsFile).urls

let href = []
let hrefError = []
let count = 0

function replaceText(text){
	if(text) {
    	return text.replace(/\n/g, "").replace(/\t/g, "");
	}
}

function start(urls) {
	urls.forEach((uItem, i, arr) => {
		setTimeout(() => {
			get(uItem)
		}, i * 2000)
	})
}

function get(uItem, flag) {
	let http = uItem.url
	let cookie = "cback=" + uItem.url + ";"
	console.log("get page " + uItem.page)
	superagent
		.get(http)
		.set('Cookie', cookie)
		.set('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36')
		.set('Referer','http://www.zhongchou.cn/?tt=1531660329.217')
		.set('Accept','*/*')
		.set('Accept-Encoding','gzip, deflate')
		.set('Accept-Language','zh-CN,zh;q=0.9,en;q=0.8')
		// .redirects(2)
		// .retry(2)
		.timeout({
			response: 5000,
			deadline: 60000
		})
		.end((err, res) => {
			if(err) {
				console.log("get page " + uItem.page + " error")
				if(!flag) {
					setTimeout(() => {
						console.log("try get page " + uItem.page + " time 1")
						get(uItem, 1)
					}, (Math.floor(Math.random()*3+1)*1000))
				}else {
					flag++
					if(flag >= 3) {
						console.log("try get page " + uItem.page + " failed")
						let obj = {
							page: uItem.page,
							url: uItem.url
						}
						hrefError.push(obj)
						count++
						if(count == 292) {
							write()
						}
					}else {
						setTimeout(() => {
							console.log("try get page " + uItem.page + " time " + flag)
							get(uItem, flag)
						}, (Math.floor(Math.random()*(3+flag)+1)*1000))
					}
				}
			}else {
				let $ = cheerio.load(res.text)
				if($(".ssCardItem").length == 0) {
					console.log(res.text)
				}
				$(".ssCardItem").each((i, hItem) => {
					let obj = {}
					obj.id = (uItem.page - 1) * 24 + i + 1
					obj.name = replaceText($(hItem).find(".siteCardICH3").text().trim())
					obj.website = $(hItem).find(".siteCardItemImgA").attr("href")
					obj.money = replaceText($(hItem).find(".ftDiv .ftP").text().trim())
					obj.support = replaceText($(hItem).find(".scDiv .ftP").text().trim())
					obj.percent = replaceText($(hItem).find(".thDiv .ftP").text().trim())
					href.push(obj)
				})
				console.log("get page " + uItem.page + " over")
				count++
				if(count == 292) {
					write()
				}
			}
		})
}

function write() {
	fs.writeFile(
		__dirname + '/data/href.json',
		JSON.stringify({
			href: href
		}),
		(err) => {
			if (err) {
				console.log('href文件保存失败!')
			};
			console.log('href文件已保存!')
		}
	)
	fs.writeFile(
		__dirname + '/data/href-error.json',
		JSON.stringify({
			hrefError: hrefError
		}),
		(err) => {
			if (err) {
				console.log('hrefError文件保存失败!')
			};
			console.log('hrefError文件已保存!')
		}
	)
}

start(urls)