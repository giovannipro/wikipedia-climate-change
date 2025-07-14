const container = "#dv2";
const font_size = 10;

const filter_item = 100;

const shiftx_article = 30;
const wiki_link = "https://en.wikipedia.org/wiki/";
const variation_line_opacity = 0.7;

let limit_y_min = 500
let limit_y_max = 200000
let max_update = 0
let min_update = 0

const stroke_dash = "3,3";

const log_exponent = 0.5; 

let y_axis_value = 'daily'

function dv2(the_sort) {

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
		console.log(data)

		data = format_data(data)
		filtered_data = data
	
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

		let y_max = 0

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

		// update the top bar filters
		// --------------

		const min_pageviews = document.getElementById("min_pageviews")
		const max_pageviews = document.getElementById("max_pageviews")

		min_pageviews.value	= limit_y_min;
		max_pageviews.value = limit_y_max;

		const filter_instance = document.getElementById("filter_instance");

		// remove categoris with count < 2
		const counts = filtered_data.reduce((acc, d) => {
			acc[d.instance_of] = (acc[d.instance_of] || 0) + 1;
			return acc;
		}, {});

		const sortedCategories = Object.entries(counts)
			.filter(([cat, count]) => count >= 1)
			.sort((a, b) => {
				// First sort by count descending
				if (b[1] !== a[1]) return b[1] - a[1];

				// Then sort alphabetically ascending
				return a[0].localeCompare(b[0]);
		});
		
		sortedCategories.forEach(([cat, count]) => {
			const option = document.createElement("option");
			option.value = cat;
			option.textContent = `${cat} (${count})`;  // Optional: show count
			filter_instance.appendChild(option);
		});

		function display_data(instance, the_sort, limit_y_min, limit_y_max, y_axis_value){ // region, category, 
			// console.log(y_axis_value)

			the_sort = parseInt(the_sort)

			if (d3.selectAll('.article')){
				d3.selectAll('.article').remove()
			}

			// filter data by region and category
			// ---------------------------

			the_data = data.sort((a, b) => a.article.localeCompare(b.article));

			if (instance == 'all'){
				filtered_data = the_data.filter(item =>
					item.avg_pv > limit_y_min
					&&
					item.avg_pv  < limit_y_max
				)
			}
			else {
				filtered_data = the_data.filter(item =>
					item.instance_of == instance
					&&
					item.avg_pv > limit_y_min
					&&
					item.avg_pv  < limit_y_max
				)
			}

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
			else if (the_sort == 8){
				min = d3.min(filtered_data, function(d) {
					return d.edits_editors_ratio
				})
				max = d3.max(filtered_data, function(d) { 
					return d.edits_editors_ratio
				})
			}
			else if (the_sort == 9){
				min = d3.min(filtered_data, function(d) {
					return d.linguistic_versions
				})
				max = d3.max(filtered_data, function(d) { 
					return d.linguistic_versions
				})
			}
			// console.log(min, max)

			if (y_axis_value == 'daily'){
				y_min = d3.min(filtered_data, function(d) { 
					return d.avg_pv;
				})
	
				y_max = d3.max(filtered_data, function(d) { 
					return d.avg_pv;
				})
			}
			else {
				y_min = d3.min(filtered_data, function(d) { 
					return d.total_views;
				})
	
				y_max = d3.max(filtered_data, function(d) { 
					return d.total_views;
				})
			}
			// console.log(y_axis_value, y_min, y_max)

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
					// console.log(y_axis_value)

					if (the_sort == 1) { // title
						direction = tooltip_direction(filtered_data, i, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 2){
						direction = tooltip_direction(filtered_data, d.days, min, max, d.avg_pv, d.total_views, true)
					}
					else if (the_sort == 3){
						direction = tooltip_direction(filtered_data, d.size, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 4){
						direction = tooltip_direction(filtered_data, d.discussion_size, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 5){
						direction = tooltip_direction(filtered_data, d.incipit_size, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 6){
						direction = tooltip_direction(filtered_data, d.issues, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 7){
						direction = tooltip_direction(filtered_data, d.images, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 8){
						direction = tooltip_direction(filtered_data, d.edits_editors_ratio, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 9){
						direction = tooltip_direction(filtered_data, d.linguistic_versions, min, max, d.avg_pv, d.total_views, false)
					}

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
						direction = tooltip_direction(filtered_data, i, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 2){
						direction = tooltip_direction(filtered_data, d.days, min, max, d.avg_pv, d.total_views, true)
					}
					else if (the_sort == 3){
						direction = tooltip_direction(filtered_data, d.size, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 4){
						direction = tooltip_direction(filtered_data, d.discussion_size, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 5){
						direction = tooltip_direction(filtered_data, d.incipit_size, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 6){
						direction = tooltip_direction(filtered_data, d.issues, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 7){
						direction = tooltip_direction(filtered_data, d.images, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 8){
						direction = tooltip_direction(filtered_data, d.edits_editors_ratio, min, max, d.avg_pv, d.total_views, false)
					}
					else if (the_sort == 9){
						direction = tooltip_direction(filtered_data, d.linguistic_versions, min, max, d.avg_pv, d.total_views, false)
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
					else if (the_sort == 8){
						x_position = x(d.edits_editors_ratio)
					}
					else if (the_sort == 9){
						x_position = x(d.linguistic_versions)
					}
					else {
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

					let output = ''
					if (y_axis_value == 'daily'){
						// console.log('daily', d.article, d.avg_pv)
						output = "translate(" + 0 + "," + y(d.avg_pv) + ")"
					}
					else {
						// console.log('total', d.article, d.total_views)
						output = "translate(" + 0 + "," + y(d.total_views) + ")"
					}

					return output 
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

			let circles = article_circles.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2
				})
				.attr("cx",0)
				.attr("cy",0)	
				.attr("fill", d => categoryColors[d.instance_of] || categoryColors.default)
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
				.attr("fill", d => categoryColors[d.instance_of] || categoryColors.default)
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
				.attr("stroke", d => categoryColors[d.instance_of] || categoryColors.default)
				.attr("fill","transparent")
				.attr("stroke-width",0.5)
				.attr("opacity",0.9)
				.attr("r",0)
				.transition()
				.delay(1000)
				.ease(d3.easeLinear)
				.duration(500) 
				.attr("r", function(d,i){
					return r(Math.sqrt(d.discussion_size/3.14))
				})
				.attr("data-discussion", function(d,i){
					return d.discussion_size
				})

			// restrictions
			const padlock_width = 6
			const padlock_animation = 500
			let padlock = article_circles.append('g')
				.attr('transform', function(d,i){
					const x = r(Math.sqrt(d.size/3.14)) + 5 + (padlock_width/2)
					return "translate(" + x + "," + 0 + ")"
				})
				
			let padlock_a = padlock.append("circle")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2 + padlock_animation
				})
				.ease(d3.easeLinear)
				.duration(padlock_animation) 
				.attr('stroke-width',1)
				.attr("r",0)
				.attr("fill", "transparent")
				.attr("stroke", function (d){
					if (d.restrictions != ''){
						return "gray"
					}
					else {
						return "transparent"
					}
				})
				.attr("r",padlock_width/2 - 1)
			
			let padlock_b = padlock.append("rect")
				.transition()
				.duration(500)
				.delay(function(d,i){ 
					return i * 2 +  padlock_animation
				})
				.ease(d3.easeLinear)
				.duration(padlock_animation) 
				.attr("width",0)
				.attr("height",0)
				.attr('x',-padlock_width/2)
				.attr('y',0)
				.attr("stroke", function (d){
					if (d.restrictions != ''){
						return "gray"
					}
					else {
						return "transparent"
					}
				})
				.attr("fill", function (d){
					if (d.restrictions != ''){
						return "white"
					}
					else {
						return "transparent"
					}
				})
				.attr("width",padlock_width)
				.attr("height",padlock_width/5*4)
			

			sidebar(2,filtered_data,the_sort)

			// sort data
			// ---------------------------
			const sort_box = document.getElementById('sort_article')
			sort_box.addEventListener("change", function() {

				let new_sort = this.value;
				// let new_region = region_box.options[region_box.selectedIndex].value;

				// console.log(y_axis_value)
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
				else if (the_sort == 8){
					min = d3.min(filtered_data, function(d) { 
						return d.edits_editors_ratio
					})
					max = d3.max(filtered_data, function(d) { 
						return d.edits_editors_ratio
					})
				}
				else if (the_sort == 9){
					min = d3.min(filtered_data, function(d) { 
						return d.linguistic_versions
					})
					max = d3.max(filtered_data, function(d) { 
						return d.linguistic_versions
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
						else if (the_sort == 8){
							x_position = x(d.edits_editors_ratio)
						}
						else if (the_sort == 9){
							x_position = x(d.linguistic_versions)
						}
						else {
							x_position = x(i)
						}
						// console.log(d.article,min,max,d.size,width,x_position)
						return "translate(" + (x_position + 50) + "," + 0 + ")"
					})

				tooltip
					.direction(function (d,i) {

						let direction = ''
						if (the_sort == 1) { // title
							direction = tooltip_direction(filtered_data, i, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 2){
							direction = tooltip_direction(filtered_data, d.days, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 3){
							direction = tooltip_direction(filtered_data, d.size, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 4){
							direction = tooltip_direction(filtered_data, d.discussion_size, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 5){
							direction = tooltip_direction(filtered_data, d.incipit_size, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 6){
							direction = tooltip_direction(filtered_data, d.issues, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 7){
							direction = tooltip_direction(filtered_data, d.images, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 8){
							direction = tooltip_direction(filtered_data, d.edits_editors_ratio, min, max, d.avg_pv, d.total_views, false)
						}
						else if (the_sort == 9){
							direction = tooltip_direction(filtered_data, d.linguistic_versions, min, max, d.avg_pv, d.total_views, false)
						}
						return direction 
					})
				sidebar(2,filtered_data,the_sort)
			}
		}
		display_data('all',the_sort,filter_item, limit_y_max, y_axis_value) // region, category,

		// yaxis label
		let yaxis_label_box = plot.append("g")
			.attr("class","yaxis_label")
			.attr("transform","translate(7," + (height -18) + ")")
			.attr("class","hover") 
			.on("mouseover", y_axis_mouseover) 
			.on("mouseout", y_axis_mouseout) 
			.on("click", y_axis_switch) 
	
		let yaxis_label_rect = yaxis_label_box.append("rect")
			.attr("width", 120)
			.attr("height", 20)
			.attr("transform","translate(0,-18)")
			.attr("stroke", "gray")
			.attr("fill","white")
			.attr("opacity",0.8)
			.attr("rx",5)
			.attr("ry",5)

		let yaxis_label = yaxis_label_box.append("text")
			.attr("class","lang_switch")
			.text("average daily visits")
			.attr("data-it","media visite giornaliere")
			.attr("data-en","average daily visits")
			.attr("id","yaxis_label")
			.attr("y", -5)
			.attr("x", 3)
			.attr("font-size",font_size)

		function y_axis_mouseover(){
			d3.select(this)
				.transition()
				.duration(duration)
				.attr("opacity",1)
		}

		function y_axis_mouseout(){
			d3.select(this)
				.transition()
				.duration(duration)
				.attr("opacity",0.8)
		}

		function y_axis_switch(){

			if (y_axis_value == 'daily'){
				y_axis_value = 'total'	
				
				d3.select(this).select('text')
					.text("total visits")
			}
			else {
				y_axis_value = 'daily'

				d3.select(this).select('text')
					.text("average daily visits")
			}
			
			scale = 'linear'
			// console.log(scale, y_axis_value)
			update_scale(scale, y_axis_value, false)
		}

		// chart scale
		// ---------------------------
		
		function update_scale(scale, y_axis_value, switch_log){

			y = d3.scaleLinear()

			if (switch_log == false){

				if (y_axis_value == 'daily'){
					y_min = d3.min(filtered_data, function(d) { 
						return d.avg_pv;
					})
		
					y_max = d3.max(filtered_data, function(d) { 
						return d.avg_pv;
					})
				}
				else {
					y_min = d3.min(filtered_data, function(d) { 
						return d.total_views;
					})
		
					y_max = d3.max(filtered_data, function(d) { 
						return d.total_views;
					})
				}
			}

			if (scale == "linear"){
				y = d3.scaleLinear()
					.domain([0,y_max+(y_max/100*10)])
					.range([height - (margin.top * 1.6),0])
			}
			else if (scale == "log"){
				y = d3.scaleSymlog(10)
					.domain([0,y_max+(y_max/100*10)])
					.range([height - (margin.top * 1.6),0])
			}

			// articles
			svg.selectAll(".article_circles")
				.transition()
				.duration(200)
				.attr("transform",function (d,i) {
					let output = ''
					if (y_axis_value == 'daily'){
						output = "translate(" + 0 + "," + y(d.avg_pv) + ")"
					}
					else {
						output = "translate(" + 0 + "," + y(d.total_views) + ")"
					}
					return output
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

		function chart_scale(){

			function to_log(){
				update_scale("log", y_axis_value, true)

				the_path = load_path() 
				scale_icon.style.background = "url(" + the_path + "assets/img/scale_linear.svg) center center / 55% no-repeat"
				scale = "log"

				tootip_linear.style.display = 'none'
				tootip_log.style.display = 'block'
			}

			function to_linear(){
				update_scale("linear", y_axis_value, true)

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

			// filter by page views an by instane
			// --------------------

			const display_filter = document.getElementById("display_filter")
			const filter_instance = document.getElementById("filter_instance")

			display_filter.addEventListener('click', (event) => {
				update_filter()
			})

			filter_instance.addEventListener('change', function() {
				update_filter()
			})
			
			function update_filter(){
				const min_pageviews = document.getElementById("min_pageviews")
				const max_pageviews = document.getElementById("max_pageviews")
				const the_instance = document.getElementById("filter_instance")
				const sort_box = document.getElementById('sort_article')
				
				let new_sort = sort_box.value;

				const new_limit_y_min = parseInt(min_pageviews.value)
				const new_limit_y_max = parseInt(max_pageviews.value)
				const instance = the_instance.value

				// console.log(y_axis_value)
				display_data(instance, new_sort, new_limit_y_min, new_limit_y_max, y_axis_value)
			}
		}
		chart_scale()

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
					else if (the_sort == 7){
						x_position = x(d.images)
					}
					else if (the_sort == 8){
						x_position = x(d.edits_editors_ratio)
					}
					else if (the_sort == 9){
						x_position = x(d.linguistic_versions)
					}
					else { 
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

function tooltip_direction(data, the_x, x_min, x_max, y_avg, y_tot,invert){

	// console.log(the_x)

	let y_max = 0
	let y = 0
	if (y_axis_value == 'daily'){
		y_max = d3.max(data, function(d) { 
			return d.avg_pv;
		})

		y = y_avg
	}
	else {
		y_max = d3.max(data, function(d) { 
			return d.total_views;
		})

		y = y_tot
	}

	x = parseInt(the_x)
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
	// console.log(y, y_max, direction, y_axis_value)

	return direction
}

window.onload = function() {
	dv2(1);
}