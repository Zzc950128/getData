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

function start(num) {
	setTimeout(() => {
		get(num)
	}, (Math.floor(Math.random()*3+1)*1000))
}

function get(num, flag) {
	let http = urls[num].url
	console.log("get page " + urls[num].page)
	superagent
		.get(http)
		.timeout({
			response: 5000,
			deadline: 60000
		})
		.end((err, res) => {
			if(err) {
				console.log("get page " + urls[num].page + " error")
				if(!flag) {
					setTimeout(() => {
						console.log("try get page " + urls[num].page + " time 1")
						get(num, 1)
					}, (Math.floor(Math.random()*3+1)*1000))
				}else {
					flag++
					if(flag >= 5) {
						console.log("try get page " + urls[num].page + " failed")
						let obj = {
							page: urls[num].page,
							url: urls[num].url
						}
						hrefError.push(obj)
						count++
						if(count == 5) {
							write()
						}else {
							start(count)
						}
					}else {
						setTimeout(() => {
							console.log("try get page " + urls[num].page + " time " + flag)
							get(num, flag)
						}, (Math.floor(Math.random()*(3+flag)+1)*1000))
					}
				}
			}else {
				// console.log(res)
				let $ = cheerio.load(res.text)
				if($(".ssCardItem").length == 0) {
					console.log("get page " + urls[num].page + " content error")
					if(!flag) {
						setTimeout(() => {
							console.log("try get page " + urls[num].page + " time 1")
							get(num, 1)
						}, (Math.floor(Math.random()*3+1)*1000))
					}else {
						flag++
						if(flag >= 5) {
							console.log("try get page " + urls[num].page + " failed")
							let obj = {
								page: urls[num].page,
								url: urls[num].url
							}
							hrefError.push(obj)
							count++
							if(count == 5) {
								write()
							}else {
								start(count)
							}
						}else {
							setTimeout(() => {
								console.log("try get page " + urls[num].page + " time " + flag)
								get(num, flag)
							}, (Math.floor(Math.random()*(3+flag)+1)*1000))
						}
					}
				}else {
					$(".ssCardItem").each((i, hItem) => {
						let obj = {}
						obj.id = (urls[num].page - 1) * 24 + i + 1
						obj.name = replaceText($(hItem).find(".siteCardICH3").text().trim())
						obj.website = $(hItem).find(".siteCardItemImgA").attr("href")
						obj.money = replaceText($(hItem).find(".ftDiv .ftP").text().trim())
						obj.support = replaceText($(hItem).find(".scDiv .ftP").text().trim())
						obj.percent = replaceText($(hItem).find(".thDiv .ftP").text().trim())
						href.push(obj)
					})
					console.log("get page " + urls[num].page + " over")
					count++
					if(count == 5) {
						write()
					}else {
						start(count)
					}
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

start(0)