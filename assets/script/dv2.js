const container = "#dv2";
const font_size = 10;

// const filter_item = 12; // also in Wikipedia and Italian school is 120

const shiftx_article = 30;
const wiki_link = "https://en.wikipedia.org/wiki/";
const variation_line_opacity = 0.7;
const min_avg_pv = 100;

const stroke_dash = "3,3";

const log_exponent = 0.5; 

function dv2(the_sort) { // region, category,

	// size constants
	let window_w = document.getElementById("dv2").offsetWidth;
		window_h = document.getElementById("dv2").offsetHeight;

	let margin = {top: 20, left: 0, bottom: 20, right: 60},
		width = window_w - (margin.right + margin.right),
		height = window_h - (margin.top + margin.bottom);

	if (width <= 768){
		translate_articles = 10
		reduction = 30
	}
	else {
		translate_articles = shiftx_article
		reduction = 100
	}

	// load data
	d3.tsv("assets/data/voci.tsv")
		.then(loaded)

	function loaded(data) {
		// console.log(data,region,the_sort)

		data = format_data(data)
		filtered_data = data
		// console.log(data)
	
		statistics(data)

		// svg 
		// ---------------------------
		let svg = d3.select(container)
			.append("svg")
			.attr("width", width + (margin.right + margin.right))
			.attr("height",height + (margin.top + margin.bottom))
			.attr("id", "svg")

		// scale 
		// ---------------------------

		let min = 0
		let max = filtered_data.length
		// console.log(min,max)

		let y_max = d3.max(filtered_data, function(d) { 
			return d.avg_pv;
		})

		let r_max = d3.max(filtered_data, function(d) { 
			return Math.sqrt(d.size/3.14);
		})

		let r = d3.scaleLinear()
			.range([min_circle_size, max_circle_size])
			.domain([0,r_max])

		let y = d3.scaleLinear() // scaleSymlog() > it works
			// .domain([0,y_max + (y_max/100*10)]) 
			// .range([height - (margin.top * 10), 0])

		let x = d3.scaleLinear()
			.domain([min,max])
			.range([0,width - reduction])
       
		// grid and plot
		// ---------------------------

		let grid = svg.append("g")
			.attr("id","grid")
			.attr("transform", "translate(-1," + margin.top*2 + ")")
			.call(make_y_gridlines()
				.tickSize(-width-margin.left-margin.right-60)
			)

		let plot = svg.append("g")
			.attr("id", "d3_plot")
			.attr("transform", "translate(" + margin.right + "," + margin.top + ")");

       	// axis and grid 
		// ---------------------------

		let yAxis_margin = 10;
		if (window_w < 700){
			yAxis_margin = 0;
		}
		let yAxis = plot.append("g")
			.attr("id","yAxis")
			.attr("transform", "translate(" + yAxis_margin + "," + (margin.top) +")")
			.call(d3.axisLeft(y))
			.selectAll("text")
			.attr("y", -10)

		let yaxis_label_box = plot.append("g")
			.attr("class","yaxis_label")
			.attr("transform","translate(7," + height + ")")

		let yaxis_label = yaxis_label_box.append("text")
			.attr("class","axis_name")
			.text("visite giornaliere (media)")
			.attr("data-it","visite giornaliere (media)")
			.attr("data-en","daily visits (average)")
			.attr("y",2)
			.attr("font-size",font_size)

		function make_y_gridlines() {		
			return d3.axisLeft(y)
		}
	
        let tooltip = get_tooltip('dv2')
	    plot.call(tooltip);

       	const duration = 0
	    function handleMouseOver(){
	    	
			// hide circles
			d3.selectAll(".article_circles,.line_prev,.circle_prev")
				.transition()
				.duration(duration)
				.attr("opacity",0.2)

			// highlight
			d3.select(this)
				.transition()
				.duration(duration)
				.attr("opacity",1)

			d3.select(this.previousSibling).select(".circle_prev,.line_prev")
				.transition()
				.duration(duration)
				.attr("opacity",1)
		}

	    function handleMouseOut(){
			d3.selectAll(".article_circles")
				.transition()
				.duration(duration)
				.attr("opacity",1)

			d3.selectAll(".variation").select(".circle_prev")
				.transition()
				.duration(duration)
				.attr("opacity",0)

			d3.selectAll(".variation").select(".line_prev")
				.transition()
				.duration(duration)
				.attr("opacity",variation_line_opacity)
		}

		let articles = plot.append("g")	
			.attr("id","articles")
			.attr("transform","translate(" + translate_articles + "," + (margin.top) + ")")	

		plot.call(tooltip)

		function display_data(the_sort){ // region, category, 
			// console.log(data)
			console.log(the_sort)

			the_sort = parseInt(the_sort)

			if (d3.selectAll('.article')){
				d3.selectAll('.article').remove()
			}

			// filter data by region and category
			// ---------------------------

			filter_item = 100

			the_data = data.sort((a, b) => a.article.localeCompare(b.article));

			filtered_data = the_data.filter(item =>
				item.avg_pv > filter_item
			)

			// if (region == 'all'){
			// 	// region_data = data 
			// 	region_data = data
			// 	// data.filter(item =>
			// 	// 	item.avg_pv > filter_item
			// 	// )
			// }
			// else {
			// 	region_data = data.filter(item => 
			// 		item.region === region
			// 	)
			// }
			// console.log(region_data)

			// if (category != 'all'){
			// 	filtered_data = region_data.filter(item =>
			// 		item.category === category
			// 	)
			// 	.filter(item =>
			// 		item.size > 0
			// 	)
			// }
			// else {
			// 	filtered_data = region_data.filter(item =>
			// 		item.avg_pv > filter_item
			// 	)
			// }
			// console.log(filtered_data)

			// if (filtered_data.length == 0){
			// 	show_no_data()
			// }


			// review the elements attributes
			// ---------------------------

			if (the_sort == 1) {
				min = 0
				max = filtered_data.length - 1
			}
			else if (the_sort == 2){
				min = d3.min(filtered_data, function(d) { 
					return d.days;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.days;
				})
			}
			else if (the_sort == 3){
				min = d3.min(filtered_data, function(d) { 
					return d.size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.size;
				})
			}
			else if (the_sort == 4){
				min = d3.min(filtered_data, function(d) { 
					return d.discussion_size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.discussion_size;
				})
			}
			else if (the_sort == 5){
				min = d3.min(filtered_data, function(d) { 
					return d.incipit_size;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.incipit_size;
				})
			}
			else if (the_sort == 6){
				min = d3.min(filtered_data, function(d) { 
					return d.issues;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.issues;
				})
			}
			else if (the_sort == 7){
				min = d3.min(filtered_data, function(d) { 
					return d.images;
				})
				max = d3.max(filtered_data, function(d) { 
					return d.images;
				})
			}
			console.log(min, max)

			y_min = d3.min(filtered_data, function(d) { 
				return d.avg_pv;
			})

			y_max = d3.max(filtered_data, function(d) { 
				return d.avg_pv;
			})

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width-100])

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width-100])

			y = d3.scaleLinear()
				.domain([0,y_max+(y_max/100*10)]) 
				.range([height - (margin.top * 1.6),0])

			tooltip
				.offset(function (d,i){
					let direction = ''
					let off = [0,0] // [top, left]

					if (the_sort == 1) { // title
						direction = tooltip_direction(filtered_data, i, min, max, d.avg_pv, false)
					}
					else if (the_sort == 2){
						direction = tooltip_direction(filtered_data,d.days,min,max,d.avg_pv, true)
					}
					else if (the_sort == 3){
						direction = tooltip_direction(filtered_data,d.size,min,max,d.avg_pv, false)
					}
					else if (the_sort == 4){
						direction = tooltip_direction(filtered_data,d.discussion_size,min,max,d.avg_pv, false)
					}
					else if (the_sort == 5){
						direction = tooltip_direction(filtered_data,d.incipit_size,min,max,d.avg_pv, false)
					}
					else if (the_sort == 6){
						direction = tooltip_direction(filtered_data,d.issues,min,max,d.avg_pv, false)
					}
					else if (the_sort == 7){
						direction = tooltip_direction(filtered_data,d.images,min,max,d.avg_pv, false)
					}
					// console.log(d.article, direction)
					// let size = (r(Math.sqrt(d.size/3.14)) * 0.10) + 20

					if (direction == 'nw'){
						off = [-10,-10] 
					}
					else if (direction == 'n'){
						off = [-10,0] 
					}
					else if (direction == 'ne'){
						off = [-10,-10] 
					}

					return off
				})
				.direction(function (d,i) {
					let direction = ''
					if (the_sort == 1) { // title
						direction = tooltip_direction(filtered_data, i, min, max, d.avg_pv, false)
					}
					else if (the_sort == 2){
						direction = tooltip_direction(filtered_data,d.days,min,max,d.avg_pv, true)
					}
					else if (the_sort == 3){
						direction = tooltip_direction(filtered_data,d.size,min,max,d.avg_pv, false)
					}
					else if (the_sort == 4){
						direction = tooltip_direction(filtered_data,d.discussion_size,min,max,d.avg_pv, false)
					}
					else if (the_sort == 5){
						direction = tooltip_direction(filtered_data,d.incipit_size,min,max,d.avg_pv, false)
					}
					else if (the_sort == 6){
						direction = tooltip_direction(filtered_data,d.issues,min,max,d.avg_pv, false)
					}
					else if (the_sort == 7){
						direction = tooltip_direction(filtered_data,d.images,min,max,d.avg_pv, false)
					}
					return direction 
				})

			svg.select("#yAxis")
				.transition()
				.duration(200)
				.call(d3.axisLeft(y))

			d3.select('#grid')
				.transition()
			    .duration(200)
			    .call(d3.axisLeft(y)
			    	.tickSize(-width-margin.left-margin.right-60)
			    )

			// plot data
			// ---------------------------

			// for (item of filtered_data){
			// 	console.log(item.avg_pv)
			// }

			article = articles.selectAll("g")
				.data(filtered_data)
				.enter()
				.append("g")
				.attr("class","article")
				.attr("id", function(d,i){
					return i
				})
				.attr("data-article", function(d,i){
					return d.article
				})
				.attr("data-subject", function(d,i){
					return d.subject
				})
				.attr("transform", function(d,i){
					if (the_sort == 1) { // "article"
						x_position = x(i)
					}
					else if (the_sort == 2){
						x_position = x(d.days)
					}
					else if (the_sort == 3){
						x_position = x(d.size)
					}
					else if (the_sort == 4){
						x_position = x(d.discussion_size)
					}
					else if (the_sort == 5){
						x_position = x(d.incipit_size)
					}
					else if (the_sort == 6){
						x_position = x(d.issues)
					}
					else if (the_sort == 7){
						x_position = x(d.images)
					}
					else { // the_sort === undefined
						x_position = x(i)
					}
					return "translate(" + (x_position + 50) + "," + 0 + ")"
				})
				.on("mouseover", tooltip.show) 
				.on("mouseout", tooltip.hide)

			// articles
			let article_circles = article.append("g")
				.attr("class","article_circles")
				.attr("transform",function (d,i) {
					return "translate(" + 0 + "," + y(+d.avg_pv) + ")"
				})	
				.attr("id", function(d,i){
					return 'id_' + d.id_wikidata
				})
				.on("mouseover", handleMouseOver) 
				.on("mouseout", handleMouseOut)
				.append("a")
				.attr("xlink:href", function(d,i){
					return wiki_link + d.article
				})
				.attr("target","_blank")

			const color = d3.scaleOrdinal(d3.schemePaired);

			let circles = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)	
				.attr("fill", d => color(d.instance))
				// .attr("fill", function(d,i){
				// 	return "#00b2ff"
				// })
				.attr("opacity",0.5)
				.attr("r",0)
				.transition()
				.ease(d3.easeLinear)
				.duration(500) 
				.attr("r", function(d,i){
					return r(Math.sqrt(d.size/3.14)) 
				})
				.attr("data-size", function(d,i){
					return d.size
				})

			let incipit = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill", function(d,i){
					return "#00b2ff"
				})
				.attr("opacity",0.5)
				.attr("r", function(d,i){
					return r(Math.sqrt(d.incipit_size/3.14))
				})
				.attr("data-incipit", function(d,i){
					return d.incipit_size
				})

			let discussion = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)
				.attr("stroke", function(d,i){
					return "#00b2ff"
				})
				.attr("fill","transparent")
				.attr("stroke-width",0.5)
				.attr("opacity",0.9)
				.attr("r",0)
				.transition()
				.delay(500)
				.ease(d3.easeLinear)
				.duration(500) 
				.attr("r", function(d,i){
					return r(Math.sqrt(d.discussion_size/3.14))
				})
				.attr("data-discussion", function(d,i){
					return d.discussion_size
				})

			sidebar(2,filtered_data,the_sort)

			// sort data
			// ---------------------------
			const sort_box = document.getElementById('sort_article')
			sort_box.addEventListener("change", function() {
				// const region_box = document.getElementById('regions')

				let new_sort = this.value;
				// let new_region = region_box.options[region_box.selectedIndex].value;

				update_sort(new_sort)
			});

			function update_sort(the_sort){ // region
				
				the_sort = parseInt(the_sort)

				if (the_sort == 1) {
					min = 0
					max = filtered_data.length
				}
				else if (the_sort == 2){
					min = d3.min(filtered_data, function(d) { 
						return d.days;
					})
					max = d3.max(filtered_data, function(d) { 
						return d.days;
					})
				}
				else if (the_sort == 3){
					min = d3.min(filtered_data, function(d) { 
						return d.size;
					})
					max = d3.max(filtered_data, function(d) { 
						return d.size;
					})
				}
				else if (the_sort == 4){
					min = d3.min(filtered_data, function(d) { 
						return d.discussion_size;
					})
					max = d3.max(filtered_data, function(d) { 
						return d.discussion_size;
					})
				}
				else if (the_sort == 5){
					min = d3.min(filtered_data, function(d) { 
						return d.incipit_size;
					})
					max = d3.max(filtered_data, function(d) { 
						return d.incipit_size;
					})
				}
				else if (the_sort == 6){
					min = d3.min(filtered_data, function(d) { 
						return d.issues;
					})
					max = d3.max(filtered_data, function(d) { 
						return d.issues;
					})
				}
				else if (the_sort == 7){
					min = d3.min(filtered_data, function(d) { 
						return d.images;
					})
					max = d3.max(filtered_data, function(d) { 
						return d.images;
					})
				}

				if (the_sort == 2){
					x = d3.scaleLinear()
						.domain([max,min])
						.range([0,width-100])
				}
				else {
					x = d3.scaleLinear()
						.domain([min,max])
						.range([0,width-100])
				}
				// console.log(filtered_data)

				let sort = [
					"article",		// 1
					"publication",	// 2
					"size",			// 3
					"discussion",	// 4
					"incipit",		// 5
					"issue",		// 6
					"images"		// 7
				]

				// svg.selectAll(".article")
		       	// 	.data(filtered_data)
		       	// 	.enter()

				svg.selectAll(".article")
					.transition()
					.attr("transform", function(d,i){

						x_position = 0

						if (the_sort == 1) { // "article"
							x_position = x(i)
						}
						else if (the_sort == 2){
							x_position = x(d.days)
						}
						else if (the_sort == 3){
							x_position = x(d.size)
						}
						else if (the_sort == 4){
							x_position = x(d.discussion_size)
						}
						else if (the_sort == 5){
							x_position = x(d.incipit_size)
						}
						else if (the_sort == 6){
							x_position = x(d.issues)
						}
						else if (the_sort == 7){
							x_position = x(d.images)
						}
						else { // the_sort === undefined
							x_position = x(i)
						}
						// console.log(d.article,min,max,d.size,width,x_position)
						return "translate(" + (x_position + 50) + "," + 0 + ")"
					})

				tooltip
					.direction(function (d,i) {

						let direction = ''
						if (the_sort == 1) { // title
							direction = tooltip_direction(filtered_data, i, min, max, d.avg_pv, false)
						}
						else if (the_sort == 2){
							direction = tooltip_direction(filtered_data,d.days,min,max,d.avg_pv, true)
						}
						else if (the_sort == 3){
							direction = tooltip_direction(filtered_data,d.size,min,max,d.avg_pv, false)
						}
						else if (the_sort == 4){
							direction = tooltip_direction(filtered_data,d.discussion_size,min,max,d.avg_pv, false)
						}
						else if (the_sort == 5){
							direction = tooltip_direction(filtered_data,d.incipit_size,min,max,d.avg_pv, false)
						}
						else if (the_sort == 6){
							direction = tooltip_direction(filtered_data,d.issues,min,max,d.avg_pv, false)
						}
						else if (the_sort == 7){
							direction = tooltip_direction(filtered_data,d.images,min,max,d.avg_pv, false)
						}
						return direction 
					})

				sidebar(2,filtered_data,the_sort)
			}

		}
		display_data(the_sort) // region, category,

		// chart scale
		// ---------------------------

		function chart_scale(){

			function update_scale(scale){
				y = d3.scaleLinear()

				if (scale == "linear"){
					y = d3.scaleLinear()
						.domain([0,y_max+(y_max/100*10)]) 
						.range([height-margin.top,0])
				}
				else if (scale == "log"){
					y = d3.scaleSymlog(10)
						.domain([0,y_max+(y_max/100*10)]) 
						.range([height-margin.top,0])
				}

				// articles
				svg.selectAll(".article_circles")
					.transition()
					.duration(200)
					.attr("transform",function (d,i) {
						return "translate(" + 0 + "," + y(+d.avg_pv) + ")"
					})	

				// y axis ticks text
				svg.select("#yAxis")
					.transition()
					.duration(200)
					.call(d3.axisLeft(y)) // it works

				d3.select('#grid')
					.transition()
					.duration(200)
					.call(d3.axisLeft(y)
						.tickSize(-width-margin.left-margin.right-60)
					)
				}

				function to_log(){
					update_scale("log")

					the_path = load_path() 
					scale_icon.style.background = "url(" + the_path + "assets/img/scale_linear.svg) center center / 55% no-repeat"
					scale = "log"

					tootip_linear.style.display = 'none'
					tootip_log.style.display = 'block'
				}

				function to_linear(){
					update_scale("linear")

					the_path = load_path() 
					scale_icon.style.background = "url(" + the_path + "assets/img/scale_log.svg) center center / 55% no-repeat"
					scale = "linear"

					tootip_log.style.display = 'none'
					tootip_linear.style.display = 'block'
				}

				let scale = "linear"
				const switch_scale = document.getElementById("scale_button")
				const scale_icon = document.getElementById("scale_button_icon")
				const tootip_linear = document.getElementById("scale_tooltip_linear")
				const tootip_log = document.getElementById("scale_tooltip_logarithmic")

				switch_scale.addEventListener('click', (event) => {
					if (scale == "linear"){
						to_log()
					}
					else if (scale == "log") {
						to_linear()
				    }
				})

				document.onkeydown = function (e) {
				    var key = e.key;
				    if(key == 1) { // s
						to_linear()
				    }
				    else if (key == 2){
				    	to_log()
				    }
				};
		}
		chart_scale()

		// filter data by region
		// ---------------------------

		// display_data(new_sort) 

		// const region_selection = document.getElementById('regions')

		// region_selection.addEventListener('change', function() {
		// 	let new_region = this.value;
		// 	let new_category = $("#categories option:selected").val();
		// 	let new_sort =  $("#sort_article option:selected").val();

		// 	display_data(new_sort) // new_region, new_category,
		// });

		// filter data by category
		// ---------------------------

		// const category_selection = document.getElementById('categories')

		// category_selection.addEventListener('change', function() {
		// 	let new_region = $("#regions option:selected").val();
		// 	let new_category = this.value;
		// 	let new_sort =  $("#sort_article option:selected").val();

		// 	display_data(new_sort) // new_region, new_category, 
		// });


		// make the visualization responsive
		// ---------------------------
		function responsive_chart(width){

			if (width <= 768){
				translate_articles = 10
				reduction = 30

			}
			else {
				translate_articles = shiftx_article
				reduction = 100
			}
			// console.log(width, translate_articles, reduction)

			svg
				.attr("width", width + (margin.right + margin.right))

			grid
				.call(make_y_gridlines()
					.tickSize(-width-margin.left-margin.right-60)
				)

			x = d3.scaleLinear()
				.domain([min,max])
				.range([0,width - reduction])

			articles.attr("transform","translate(" + translate_articles + "," + margin.top + ")") 

			svg.selectAll(".article")
				.transition()
				.attr("transform", function(d,i){
					x_position = 0

					if (the_sort == 1) { // "article"
						x_position = x(i)
					}
					else if (the_sort == 2){
						x_position = x(d.days)
					}
					else if (the_sort == 3){
						x_position = x(d.size)
					}
					else if (the_sort == 4){
						x_position = x(d.discussion_size)
					}
					else if (the_sort == 5){
						x_position = x(d.incipit_size)
					}
					else if (the_sort == 6){
						x_position = x(d.issues)
					}
					else if (the_sort == 7){
						x_position = x(d.images)
					}
					else { // the_sort === undefined
						x_position = x(i)
					}
					// console.log(d.article,min,max,d.size,width,x_position)
					return "translate(" + x_position + "," + 0 + ")"
				})
		}

		window.addEventListener("resize", (event) => {
			window_w = document.getElementById("dv2").offsetWidth;
			width = window_w - (margin.right + margin.right)

			responsive_chart(width)
		});

		function show_no_data(){

			const lineData = [
				{y: 1},
				{y: 2},
				{y: 3},
				{y: 4},
				{y: 5},
				{y: 6},
				{y: 7}
			]

			const line_height = (height - (margin.top * 1.5)) / lineData.length 

			group = articles.append("g")
				.attr("class","article")
				.attr("transform","translate(" + (-90) + ",0)")

			lines = group.append("g")
				.attr("class","lines")
				.selectAll("lines")
				.data(lineData)
				.enter()
				.append("line")
				.attr("x1", 0)
				.attr("y1", d => d.y * line_height)
				.attr("x2", window_w)
				.attr("y2", d => d.y * line_height) 
				.attr("stroke", "#e9e4e4")
				.attr("stroke-width", 1);

			text_box = group.append("g")
				.attr("class","text")
				.attr("transform","translate(" + 0 + ",-20)")

			text_a = text_box.append("text")
				.text("Purtroppo qui non ci sono dati.")
				.attr("x",window_w / 2)
				.attr("y",height / 2)
				.attr("text-anchor","middle")

			text_b = text_box.append("text")
				.text("Prova a cambiare la selezione.")
				.attr("x",window_w / 2)
				.attr("y",height / 2 + 20)
				.attr("text-anchor","middle")
		}
	}
}

function tooltip_direction(data,x,x_min,x_max,y,invert){

	let y_max = d3.max(data, function(d) { 
		return d.avg_pv;
	})

	x = parseInt(x)
	x_min = parseInt(x_min)
	x_max = parseInt(x_max)

	let n_s = ''
	let w_e = ''
	
	if (y > (y_max/3*2) ){
		n_s = 's'
	}
	else {
		n_s = 'n'
	}		

	if (invert == false){
		let range = x_max - x_min
		if (x < (x_min + range / 3)){
			w_e = 'e'
		}
		else if ( x > (x_min + range / 3 * 2) ) {
			w_e = 'w'
		}
	}
	else {
		let range = x_max - x_min
		if (x > (x_min + range / 3)){
			w_e = 'e'
		}
		else if ( x < (x_min + range / 3 * 2) ) {
			w_e = 'w'
		}
	}

	const direction = n_s + w_e
	return direction
}

// function get_category(id, name, instances){
// 	let category = ''

// 	const instances_array = instances.split(',')
// 	name = name.toLowerCase()

// 	instances_array.sort(function(a,b){
//     	return a.localeCompare(b);
// 	})

// 	const categories = [
// 		'museo',
// 		'archivio',
// 		'biblioteca',
// 		'palazzo',
// 		'pinacoteca'
// 	]

// 	// console.log(categories)
// 	if (name.includes('museo')){
// 		category = 'museo'
// 	}
// 	else if (name.includes('castello') || name.includes('castel')) {
// 		category = 'castello'
// 	}
// 	else if (name.includes('archivio') || name.includes('cineteca')){
// 		category = 'archivio'
// 	}
// 	else if (name.includes('biblioteca')) {
// 		category = 'biblioteca'
// 	}
// 	else if (name.includes('chiesa') || name.includes('basilica') || name.includes('cattedrale') || name.includes('abbazia') || name.includes('cappella') || name.includes('oratorio')  || name.includes('santuario') ){
// 		category = 'sito religioso'
// 	}
// 	else if (name.includes('archeologico') || name.includes('archeologica') || name.includes('anfiteatro') || name.includes('necropoli') ){
// 		category = 'sito archeologico'
// 	}
// 	else {
// 		if (instances_array.some(e => e.includes('museo'))){
// 			category = 'museo'
// 		}
// 		else if (instances_array.some(e => e.includes('archivio'))){
// 			category = 'archivio'
// 		}
// 		else if (instances_array.some(e => e.includes('pinacoteca'))){
// 			category = 'pinacoteca'
// 		}
// 		else if (instances_array.some(e => e.includes('chiesa')) || instances_array.some(e => e.includes('basilica')) || instances_array.some(e => e.includes('cattedrale')) ){
// 			category = 'sito religioso'
// 		}
// 		else if (instances_array.some(e => e.includes('parco archeologico')) || instances_array.some(e => e.includes('sito archeologico'))){
// 			category = 'sito archeologico'
// 		}
// 		else {
// 			category = 'altro luogo della cultura' // instances_array
// 		}
// 	}
// 	// console.log(name, category)
// 	return category
// }

window.onload = function() {
	dv2(1);
}