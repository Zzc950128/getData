const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')

let hrefFile = fs.readFileSync(__dirname + '/data/href.json',"utf-8")
let hrefs = JSON.parse(hrefFile).href

let data = []
let dataError = []
let count = 0

function replaceText(text){
	if(text) {
    	return text.replace(/\n/g, "").replace(/\t/g, "");
	}
}

function replaceBlank(text){
	if(text) {
    	return text.replace(/\n/g, "").replace(/\t/g, "").replace(/\s/g, "");
	}
}

function start(num, end) {
	setTimeout(() => {
		get(num, end)
	}, 2000)
	// }, (Math.floor(Math.random()*3+1)*1000))
}

function get(num, end, flag) {
	let http = hrefs[num].website
	console.log("get item " + hrefs[num].id)
	superagent
		.get(http)
		.timeout({
			response: 5000,
			deadline: 60000
		})
		.end((err, res) => {
			if(err) {
				console.log("get item " + hrefs[num].id + " error")
				if(!flag) {
					setTimeout(() => {
						console.log("try get item " + hrefs[num].id + " time 1")
						get(num, end, 1)
					}, 2000)
					// }, (Math.floor(Math.random()*3+1)*1000))
				}else {
					flag++
					if(flag >= 3) {
						console.log("try get item " + hrefs[num].id + " failed")
						let obj = {
							id: hrefs[num].id,
							name: hrefs[num].name,
							website: urls[num].website
						}
						dataError.push(obj)
						count++
						if(count == end) {
							write(end)
						}else {
							start(count)
						}
					}else {
						setTimeout(() => {
							console.log("try get item " + hrefs[num].id + " time " + flag)
							get(num, end, flag)
						}, (Math.floor(Math.random()*(3+flag)+1)*1000))
					}
				}
			}else {
				// console.log(res)
				let $ = cheerio.load(res.text)
				if($("#move").length == 0) {
					console.log("get item " + hrefs[num].id + " content error")
					if(!flag) {
						setTimeout(() => {
							console.log("try get item " + hrefs[num].id + " time 1")
							get(num, end, 1)
						}, 2000)
						// }, (Math.floor(Math.random()*3+1)*1000))
					}else {
						flag++
						if(flag >= 3) {
							console.log("try get item " + hrefs[num].id + " failed")
							let obj = {
								id: hrefs[num].id,
								name: hrefs[num].name,
								website: urls[num].website
							}
							dataError.push(obj)
							count++
							if(count == end) {
								write(end)
							}else {
								start(count)
							}
						}else {
							setTimeout(() => {
								console.log("try get item " + hrefs[num].id + " time " + flag)
								get(num, end, flag)
							}, (Math.floor(Math.random()*(3+flag)+1)*1000))
						}
					}
				}else {
					let obj = {}
					obj.id = hrefs[num].id
					obj.name = hrefs[num].name
					obj.website = hrefs[num].website
					obj.money = hrefs[num].money
					obj.support = hrefs[num].support
					obj.percent = hrefs[num].percent
					obj.type = replaceText($(".gy.siteIlB_item a").eq(0).text().trim())
					obj.district = replaceText($(".addr.siteIlB_item a").eq(0).text().trim())
					let label = []
					$(".label.siteIlB_item a").each((i, labelItem) => {
						label.push(replaceText($(labelItem).text().trim()))
					})
					obj.label = label.join()
					obj.favorite = replaceText($('.heart-shaped').text().trim())
					obj.goal = replaceText($('.xqRatioText .rightSpan b').text().trim())
					obj.renew = replaceText($('#xqTabNav_ul li').eq(1).find('b').text().trim())
					obj.comment = replaceText($('#xqTabNav_ul li').eq(2).find('b').text().trim())
					obj.video = $('.xqMainLeft_vedioA').length || 0
					obj.photo = $('#xmxqBox img').length || 0
					obj.text = replaceBlank($('#xmxqBox').text().trim()).length
					let amount = []
					// $(".label.siteIlB_item a").each((i, labelItem) => {
					// 	label.push(replaceText($(labelItem).text().trim()))
					// })
					obj.amount = amount
					data.push(obj)
					console.log("get item " + hrefs[num].id + " over")
					count++
					if(count == end) {
						write(end)
					}else {
						start(count)
					}
				}
			}
		})
}

function write(end) {
	fs.writeFile(
		__dirname + '/data/data-' + end + '.json',
		JSON.stringify({
			data: data
		}),
		(err) => {
			if (err) {
				console.log('data文件保存失败!')
			};
			console.log('data文件已保存!')
		}
	)
	fs.writeFile(
		__dirname + '/data/data-error-' + end + '.json',
		JSON.stringify({
			dataError: dataError
		}),
		(err) => {
			if (err) {
				console.log('dataError文件保存失败!')
			};
			console.log('dataError文件已保存!')
		}
	)
}

start(0, 5)