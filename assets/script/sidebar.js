const min_circle_size = 0.5;
const max_circle_size = 35;

// function update_sidebar_text(){
// 	const sort_option = document.getElementById('sort_article');
// 	const text_box = document.getElementById('sidebar_text');

// 	sort = sort_option.options[sort_option.selectedIndex].text
// 	text_box.innerHTML = sort
// 	console.log(sort, sort_option)
// }

function load_edits(){
	fetch("assets/data/revisions.json.gz")
		.then(response => {
			if (!response.ok) {
				throw new Error(`Network error: ${response.status} - ${response.statusText}`);
			}
			return response.arrayBuffer();
		})
		.then(compressedData => {
			// console.log(compressedData)
			const edits_data = pako.ungzip(compressedData, { to: 'string' })
			const parsedData = JSON.parse(edits_data);
			
			// console.log(parsedData)
			edits_loaded(parsedData)
		})

	function edits_loaded(data){
		console.log('edits loaded', data.length)

		const electrocardiograms = document.getElementsByClassName('electrocardiogram');
		for (chart of electrocardiograms){
			
			the_data = data.filter(item => item.wikidata_id === chart.id.replace('revision_',''))

			if (the_data.length > 0){
				// console.log(the_data.length)

				let max_size = 0
				
				const revisions_data = the_data[0].revisions
				let  min_size = revisions_data[0].size
				// console.log(revisions_data)

				const current_revision = {
					'timestamp': new Date().toISOString(),
					'size': revisions_data[0].size
				}
				
				revisions_data.unshift(current_revision);
				
				for (edit of revisions_data){
					const the_size = edit.size 

					if (the_size > max_size) {
						max_size = the_size
					}

					if (the_size < min_size){
						min_size = the_size
					}
				}
				// console.log(min_size, max_size)

				const container = 'revision_' + the_data[0].wikidata_id
				document.getElementById(container).innerHTML = '' // clear the container
	
				width = document.getElementById(container).offsetWidth
				height = document.getElementById(container).offsetHeight

				const svg = d3.select('#' + container)
					.append("svg")
					.attr("width", width)
					.attr("height", height)

				let plot = svg.append("g")
					.attr("class", "d3_plot")
					// .attr("transform","translate(0,-1)")

				const parsedRevisions = revisions_data.map(d => ({
					date: new Date(d.timestamp),
					size: d.size
				}));
				// console.log(parsedRevisions)

				const x = d3.scaleTime()
					// .domain(d3.extent(parsedRevisions, d => d.date))
					.domain([
						new Date("2001-01-15"), // Start from Jan 1, 2000
						new Date("2025-12-31"),
						// d3.max(parsedRevisions, d => d.date) // Automatically calculate the latest date
					])
					.range([0, width]);

				// const vertical_shift = 20
				const y = d3.scaleLinear()
					.domain([0, d3.max(parsedRevisions, d => d.size)])
					.range([height - 2, 0]);
				// .domain([0,max_size])

				// const line = d3.line()
				// 	.x(d => x(d.date))
				// 	.y(d => y(d.size))
				// 	.curve(d3.curveStepAfter)

				const area = d3.area()
					.x((d) => x(d.date))
					.y0(y(0))
					.y1((d) => y(d.size))
					.curve(d3.curveStepAfter)

					
				plot.append("path")
					.datum(parsedRevisions)
					.attr("transform", `translate(0,0)`)
					.attr("class", "timeline")
					.attr("d", area)
					
				// labels
				labels = plot.append("g")
					
				labels.append("text")
					.attr("x", 0)
					.attr("y", height - 5)
					.attr("font-size", "0.6rem")
					// .attr("text-anchor","right")
					.attr("fill", "#c3c3c3")
					.text("min: " + min_size.toLocaleString() + " - max: " + max_size.toLocaleString() + ' (bytes)')
				
				plot.append("g")
					.attr("transform", `translate(0,16)`)
					.call(d3.axisTop(x));
			}
		}
	}
}

document.addEventListener("keypress", (event) => {
	if (event.key == 't' || event.key == 'T'){ // timeline
		load_edits()
	}
})

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

		const sidebar_text = document.getElementById('sidebar_text');
		const sort_ = sidebar_text.getElementsByClassName('b')[0];
		// sort_.style.textAlign = 'right'

		
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

			sort_.innerHTML = '<button" id="show_timeline" class="button_filter lang_switch" data-it="Mostra la linea temporale delle modifiche" data-en="Show size timelines" style="width: 10rem;">Show size timelines</button">'

			if (the_sort == 1){
				data = data.sort((a, b) => a.article.localeCompare(b.article));
				max = Math.max(...data.map((a,b) => a.article))

				const timeline_button = document.getElementById('show_timeline');
				timeline_button.addEventListener("click", (event) => {
					load_edits()
				})
			}
			else if (the_sort == 2){
				data.sort((a, b) => {
					return b.days - a.days;
				})
				max = Math.max(...data.map((a,b) => a.days))

				sort_.innerHTML = 'publication date'
			}
			else if (the_sort == 3){
				data.sort((a, b) => {
					return b.size - a.size;
				})
				max = Math.max(...data.map((a,b) => a.size))
				
				sort_.innerHTML = 'article size'
			}
			else if (the_sort == 4){
				data.sort((a, b) => {
					return b.discussion_size - a.discussion_size;
				})
				max = Math.max(...data.map((a,b) => a.discussion_size))

				sort_.innerHTML = 'size of discussion page'
			}
			else if (the_sort == 5){
				data.sort((a, b) => {
					return b.incipit_size - a.incipit_size;
				})
				max = Math.max(...data.map((a,b) => a.incipit_size))

				sort_.innerHTML = 'lead section size'
			}
			else if (the_sort == 6){
				data.sort((a, b) => {
					return b.issues - a.issues;
				})
				max = Math.max(...data.map((a,b) => a.issues))

				sort_.innerHTML = 'number of warning tags'
			}
			else if (the_sort == 7){
				data.sort((a, b) => {
					return b.images - a.images;
				})
				max = Math.max(...data.map((a,b) => a.images))

				sort_.innerHTML = 'number of images'
			}
			else if (the_sort == 8){
				data.sort((a, b) => {
					return b.edits_editors_ratio - a.edits_editors_ratio;
				})
				max = Math.max(...data.map((a,b) => a.edits_editors_ratio))

				sort_.innerHTML = 'ratio edits/editors (edits per editor)'
			}
			else if (the_sort == 9){
				data.sort((a, b) => {
					return b.linguistic_versions - a.linguistic_versions;
				})
				max = Math.max(...data.map((a,b) => a.linguistic_versions))

				sort_.innerHTML = 'number of linguistic versions'
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
			article_id = i + 1
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

			output += '<div class="item_value" data-wikidataId="' + d.wikidata_id + '">'
			output += '<div class="item_list" style="display: flex; align-items: center;">'

			// console.log(d.article_wikipedia)

			if (the_sort == 1){
				output += '<div class="article_list" data-id="_' + d.id + '">' + d.article + '</div>'
				output += '<div class="electrocardiogram" style="height: 50px; width: 60%; opacity: 1" id="revision_' + d.wikidata_id + '"></div>'
			}
			else {
				output += '<div class="article_list" data-id="_' + d.id + '">' + d.article + '</div>'
			}

			// if (d.article_wikipedia != "Voce non esistente"){
			// 	output += '<div class="article_list" data-id="_' + d.id + '">' + d.article + '</div>'
			// 	output += '<div>aaa</div>'
			// }
			// else {
			// 	output += '<div class="article_list" data-id="_' + d.id + '">' + d.article + ' <br/><span style="color: #f57e7e;">(voce non esistente)</span></div>'
			// 	output += '<div>aaa</div>'
			// }
		
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
				.attr("width", box_size + 230)
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

			// restrictions
			const padlock_width = 6
			const padlock_animation = 500
			let padlock = article_box.append('g')
				.attr('transform', function(d,i){
					const x = r(Math.sqrt(individual_data.size/3.14)) + 5 + (padlock_width/2)
					return "translate(" + (box_size/2 + x) + "," + box_size/2  + ")"
				})
				
			let padlock_a = padlock.append("circle")
				// .transition()
				// .duration(500)
				// .delay(function(d,i){ 
				// 	return i * 2 + padlock_animation
				// })
				// .ease(d3.easeLinear)
				// .duration(padlock_animation) 
				.attr('stroke-width',1)
				.attr("r",0)
				// .transition()
				// .delay(500)
				.attr("fill", "transparent")
				.attr("stroke", function (d){
					if (individual_data.restrictions != ''){
						return "gray"
					}
					else {
						return "transparent"
					}
				})
				.attr("r",padlock_width/2 - 1)
			
			let padlock_b = padlock.append("rect")
				// .transition()
				// .duration(500)
				// .delay(function(d,i){ 
				// 	return i * 2 +  padlock_animation
				// })
				// .ease(d3.easeLinear)
				// .duration(padlock_animation) 
				.attr("width",padlock_width)
				.attr("height",padlock_width/5*4)
				.attr('x',-padlock_width/2)
				.attr('y',0)
				.attr("stroke", function (d){
					if (individual_data.restrictions != ''){
						return "gray"
					}
					else {
						return "transparent"
					}
				})
				.attr("fill", function (d){
					if (individual_data.restrictions != ''){
						return "white"
					}
					else {
						return "transparent"
					}
				})
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