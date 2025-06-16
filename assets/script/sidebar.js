const min_circle_size = 0.5;
const max_circle_size = 35;

function update_sidebar_text(){
	// const sort_option = document.getElementById('sort_article');
	// const text_box = document.getElementById('sidebar_text');

	// sort = sort_option.options[sort_option.selectedIndex].text
	// text_box.innerHTML = sort
	// console.log(sort, sort_option)
}

function sidebar(dv,data,the_sort){
	// console.log(dv, the_sort)

	const button_open = document.getElementById('sidebar_button_open');
	const button_close = document.getElementById('sidebar_close_icon');
	const the_sidebar = document.getElementById('sidebar');
	const container = document.getElementById('sidebar_content');
	
	let output = ''
	detail = ''
	
	container.innerHTML = ''

	function load_sidebar(){
		max = -Infinity;

		output = ''
		output += '<ul>'

		// update_sidebar_text()

		if (dv == 1){
			// console.log(data)

			// data.sort((a, b) => {
			// 	return a.article - b.article;
			// })
			data.forEach(item => {
				item.article = item.article.replace(/['"]/g, ""); 
				item.article = item.article.charAt(0).toUpperCase() + item.article.slice(1);
			})
			data.sort((a, b) => a.article.localeCompare(b.article));

			max = -Infinity;
		}


		// sort data and get max
		if (dv == 2){
			if (the_sort == 1){
				// data.sort((a, b) => {
				// 	return a.article - b.article;
				// })
				
				data = data.sort((a, b) => a.article.localeCompare(b.article));
				max = Math.max(...data.map((a,b) => a.article))
			}
			else if (the_sort == 2){
				data.sort((a, b) => {
					return b.days - a.days;
				})
				max = Math.max(...data.map((a,b) => a.days))
			}
			else if (the_sort == 3){
				data.sort((a, b) => {
					return b.size - a.size;
				})
				max = Math.max(...data.map((a,b) => a.size))
			}
			else if (the_sort == 4){
				data.sort((a, b) => {
					return b.discussion_size - a.discussion_size;
				})
				max = Math.max(...data.map((a,b) => a.discussion_size))
			}
			else if (the_sort == 5){
				data.sort((a, b) => {
					return b.incipit_size - a.incipit_size;
				})
				max = Math.max(...data.map((a,b) => a.incipit_size))
			}
			else if (the_sort == 6){
				data.sort((a, b) => {
					return b.issues - a.issues;
				})
				max = Math.max(...data.map((a,b) => a.issues))
			}
			else if (the_sort == 7){
				data.sort((a, b) => {
					return b.images - a.images;
				})
				max = Math.max(...data.map((a,b) => a.images))
			}
			else if (the_sort == 8){
				data.sort((a, b) => {
					return b.edits_editors_ratio - a.edits_editors_ratio;
				})
				max = Math.max(...data.map((a,b) => a.edits_editors_ratio))
			}
			else if (the_sort == 9){
				data.sort((a, b) => {
					return b.linguistic_versions - a.linguistic_versions;
				})
				max = Math.max(...data.map((a,b) => a.linguistic_versions))
			}

			// console.log(dv, min, max)
		}
		else if (dv == 3) {
			if (the_sort == 1){
				max = Math.max(...data.map(item => item.issues));
			}
			else if (the_sort == 2){ // title
				max = -Infinity;
			}
			else if (the_sort == 3){
				max = Math.max(...data.map(item => item.references));
			}
			else if (the_sort == 4){
				max = Math.max(...data.map(item => item.notes));
			}
			else if (the_sort == 5){
				max = Math.max(...data.map(item => item.images));
			}
			else if (the_sort == 6){
				max = Math.max(...data.map(item => item.size));
			}
		}
		// console.log(max,sort)		

		// add item in the sidebar
		data.forEach(function (d,i) {
			// console.log(d.article)

			if (dv == 1){
				detail = "" // formatNumber(d.unique_editors) // d.type
				num = 0 //d.unique_editors
			}

			if (dv == 2){
				if (the_sort == 1){
					detail = ''
					num = 0
				}
				else if (the_sort == 2){
					detail = d.first_edit
					num = d.days
				}
				else if (the_sort == 3){
					detail = formatNumber(d.size)
					num =  d.size
				}
				else if (the_sort == 4){
					detail = formatNumber(d.discussion_size)
					num = d.discussion_size
				}
				else if (the_sort == 5){
					detail = formatNumber(d.incipit_size) // .toLocaleString()
					num = d.incipit_size
				}
				else if (the_sort == 6){
					detail = d.issues
					num = d.issues
				}
				else if (the_sort == 7){
					detail = d.images
					num = d.images
				}
				else if (the_sort == 8){
					detail = d.edits_editors_ratio //.toLocaleString()
					num = d.edits_editors_ratio
				}
				else if (the_sort == 9){
					detail = d.linguistic_versions.toLocaleString()
					num = d.linguistic_versions
				}
				// else if (the_sort == 8){
				// 	detail = formatNumber(d.linguistic_versions) //.toLocaleString()
				// 	num = d.linguistic_versions
				// }
			}
			else if (dv == 3) {
				if (the_sort == 1){
					detail = d.issues
					num = d.issues
				}
				else if (the_sort == 2){
					detail = ''
					num = 0
				}
				else if (the_sort == 3){
					detail = formatNumber(d.references) //.toLocaleString()
					num = d.references
				}
				else if (the_sort == 4){
					detail = formatNumber(d.notes) // .toLocaleString()
					num = d.notes
				}
				else if (the_sort == 5){
					detail = formatNumber(d.images) //.toLocaleString()
					num = d.images
				}
				else if (the_sort == 6){
					detail = formatNumber(d.size) //.toLocaleString()
					num = d.size
				}
				// else if (the_sort == 9){
				// 	detail = formatNumber(d.linguistic_versions) //.toLocaleString()
				// 	num = d.linguistic_versions
				// }
				// else if (the_sort == 6){
				// 	detail = formatNumber(d.linguistic_versions) //.toLocaleString()
				// 	num = d.linguistic_versions
				// }
			}
			// console.log(the_sort)

			if (max != 0) {
				size = num * 100 / max
			}
			else {
				size = 0
			}

			output += '<li>'

			if (d.article_wikipedia != "Voce non esistente"){
				output += '<a class="item_box" href=" ' + wiki_link + d.article + '" target="_blank"">'
			}
			else {
				output += '<a class="item_box" href="#">'
			}
			
			output += '<div class="item_bubble" id="_' + d.id + '"></div>'

			output += '<div class="item_value">'
			output += '<div class="item_list">'

			// console.log(d.article_wikipedia)
			if (d.article_wikipedia != "Voce non esistente"){
				output += '<div class="article_list" data-id="_' + d.id + '">' + d.article + '</div>'
			}
			else {
				output += '<div class="article_list" data-id="_' + d.id + '">' + d.article + ' <br/><span style="color: #f57e7e;">(voce non esistente)</span></div>'
			}
			

			// output += '<div class="article_region">' + d.region + '</div>'
		
			if (isNaN(max) == false || max < 0) {
				output += '<div class="value">' + detail + '</div>'
			}

			output += '</div>'

			if (the_sort != 1 || isNaN(max) == false){
				output += '<div class="bar" style="width: ' + size + '%;"></div>'
			}
			output += '</div>'

			output += '</a>'
			output += '</li>'


			let container = '_' + d.id // id_wikidata

			// let max_size = Math.max(...data.map((a,b) => a.size))
			instance = d.instance_of || "" 
			make_article_bubble(container,d,instance)

		})

		output += '</ul>'

		container.innerHTML = output

		// add bubbles
		data.forEach(function (d,i) {
			let container = '_' + d.id
			const instance = d.instance_of || ""
			make_article_bubble(container,d,instance)
		})

		
		function make_article_bubble(container, individual_data, instance){
			// console.log(individual_data)	
			
			const box_size = 40
			const max_article_size = 393000

			let r_max = Math.sqrt(max_article_size/3.14)

			let r = d3.scaleLinear()
				.range([min_circle_size, box_size/2])
				.domain([0,r_max])

			let svg = d3.select('#' + container)
				.append("svg")
				.attr("width", box_size)
				.attr("height", box_size)
				.attr("class", "bubble_svg")

			let article_box = svg.append("g")

			// article
			let article = article_box
				.append("circle")
				.attr("cx", box_size/2)
				.attr("cy", box_size/2)
				.attr("r", r(Math.sqrt(individual_data.size/3.14)) )
				.attr("fill", d => categoryColors[individual_data.instance_of] || categoryColors.default)
				.attr("opacity",0.5)
				// .attr("fill", function(a){
				// 	console.log(instance)
				// 	return "#00b2ff"
				// })

			let incipit = article_box
				.append("circle")
				.attr("cx", box_size/2)
				.attr("cy", box_size/2)
				.attr("r", r(Math.sqrt(individual_data.incipit_size/3.14)) )
				.attr("fill", d => categoryColors[individual_data.instance_of] || categoryColors.default)
				.attr("opacity",0.5)
				// .attr("fill", function(d,i){
				// 	return "#00b2ff"
				// })
				// .attr("fill", d => {
				// 	console.log(d)
				// 	categoryColors[d.id] || categoryColors.default
				// })

			let discussion = article_box
				.append("circle")
				.attr("cx", box_size/2)
				.attr("cy", box_size/2)
				.attr("r", r(Math.sqrt(individual_data.discussion_size/3.14)) )
				.attr("stroke", d => categoryColors[individual_data.instance_of] || categoryColors.default)
				.attr("opacity",0.9)
				.attr("fill","transparent")
				.attr("stroke-width",0.5)
				// .attr("stroke", function(d,i){
				// 	return "#00b2ff"
				// })
		}
	}
	load_sidebar()

	let open = false;
	button_open.addEventListener('click', (event) => {

		if (open == false){
			the_sidebar.style.display = 'block'
			open = true

			button_close.style.display = 'block'
			button_open.style.display = 'none'
		}
	})

	button_close.addEventListener('click', (event) => {

		if (open == true){
			the_sidebar.style.display = 'none'
			open = false

			button_close.style.display = 'none'
			button_open.style.display = 'block'
		}
	})
}