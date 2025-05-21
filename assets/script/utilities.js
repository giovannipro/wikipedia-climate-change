let lang;
let footer_it;
let footer_en;
let footer = document.getElementById('footer');

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

function apply_color(subject){
	let color;

	if (subject == "Letteratura italiana"  || subject == "Letteratura latina" || subject == "Storia" || subject == "Storia dell'arte" || subject == "Filosofia" || subject == "Grammatica italiana" || subject == "Grammatica latina") {
		color = "#ef95c4"; //"#eeb4ee";
	}
	else if (subject == "Informatica" || subject == "Tecnologia"){
		color = "#3a34e0"; // "blue";
	}
	else if (subject == "Geografia"  || subject == "Diritto e Economia" || subject == "Cittadinanza e costituzione"){
		color = "#00b2ff";
	}
	else { // Biologia Chimica Fisica Matematica Scienze della Terra Scienze
		color = "green";
	}
	return color;
}

function format_date(date){
	if (date != 0) {
		const year = date.substring(6,10);
		const month = date.substring(3,5);
		const day = date.substring(0,2);
		return day + "-" + month + "-" + year
	}
	// if (date != 0) {
	// 	const year = date.substring(0,4);
	// 	const month = date.substring(5,7);
	// 	const day = date.substring(8,10);
	// 	return day + "-" + month + "-" + year
	// }
	else {
		return "-"
	}
}

function precentage(num,tot){
	let perc = (num*100)/tot
	return parseFloat(perc.toFixed(2)) + "%";
}

function variation_perc(now,prev,parameter){
	let variation = now - prev;
	let limit = 0.5;
	let perc; 
	let output;
	let style;

	// variation percentage
    if (variation > 0){
    	perc = (((now/prev)-1)*100)
    	s = '+'
	}
	else {
		perc = (100-(now*100)/prev)
		s = '-'
	}

	// sign and style
	if (perc > limit && s == '+'){
		if (parameter == 'issues'){
			sign = '+'; 
			style = 'decrease';
		}
		else {
			sign = '+'; 
			style = 'increase';
		}
	}
	else if (perc < limit && perc > -limit) {
		sign = ''; 
		style = 'stable';
	}
	else {
		if (parameter == 'issues'){
			sign = '-'; 
			style = 'increase';
		}
		else {
			sign = "-"; 
			style = 'decrease';
		}
	}

	// output
	if (now == 0 && prev == 0) {
		output = '-' ;
		style = 'stable';
	}
	else {
		// console.log(perc)
		if (perc == Infinity){
			output = '(' + sign + variation + ')';
		}
		// else if (perc == -Infinity){
		// 	output = '(' + '-' + variation + ')';
		// }

		else if (perc > limit){
			output = '(' + sign + perc.toFixed(1) + '%)';
		}
		else if (perc < limit && perc > -limit) {
			output = '-' ;
		}
		else {
			output = '(' + sign + perc.toFixed(1) + '%)';
		}
	}

	return [style, output]
    // return [style, output  + ' ' + prev + ' '  + now];
}

// console.log(variation_perc(0,8,'images'))

const subjects = [
	"Tutte le materie",
	"Biologia",
	"Chimica",
	"Cittadinanza e costituzione",
	"Diritto e Economia",
	"Filosofia",
	"Fisica",
	"Geografia",
	"Grammatica italiana",
	"Grammatica latina",
	"Informatica",
	"Letteratura italiana",
	"Letteratura latina",
	"Matematica",
	"Scienze della Terra",
	"Scienze",
	"Storia",
	"Tecnologia"
]

// const literature_ = [
// 	"it",
// 	"la"
// ]

function mobile_menu() {
 	let open = false;

	$("#mobile_menu_icon").click(function(){

		let display = $("#mobile_menu_icon").css('display')
		// console.log(display)

		if (open == false) {

			let path = window.location.pathname;

			if (path.indexOf("viste") != -1 || path.indexOf("avvisi") != -1){
				$("#mobile_menu_icon").css("background","url('../assets/img/close-menu.svg') center center no-repeat").css("background-size","55%");
			}
			else {
				$("#mobile_menu_icon").css("background","url('assets/img/close-menu.svg') center center no-repeat").css("background-size","55%");
			}
			// console.log(path,the_path)

			$("#mobile_menu_box").show()
			open = true;
		}
		else {
			if (path.indexOf("viste") != -1 || path.indexOf("avvisi") != -1){
				$("#mobile_menu_icon").css("background","url('../assets/img/mobile-menu.svg') center center no-repeat").css("background-size","55%");			
			}
			else {
				$("#mobile_menu_icon").css("background","url('assets/img/mobile-menu.svg') center center no-repeat").css("background-size","55%");							
			}
			$("#mobile_menu_box").hide()
			open = false;
		}
	})
}

function mobile_filter() {
 	let open = false;
	let the_path;

	$("#mobile_filter_icon").click(function(){
		let path = window.location.pathname;
		
		if (open == false) {

			if (path.indexOf("viste") != -1 || path.indexOf("avvisi") != -1){ 
				$("#mobile_filter_icon").css("background","url('../assets/img/arrow-up.svg') center center no-repeat").css("background-size","55%");
			}
			else {
				$("#mobile_filter_icon").css("background","url('assets/img/arrow-up.svg') center center no-repeat").css("background-size","55%");
			}

			$("#select_box").show()
			$("#select_box").css("display","flex")
			open = true;
		}
		else {
			if (path.indexOf("viste") != -1 || path.indexOf("avvisi") != -1){ 
				$("#mobile_filter_icon").css("background","url('../assets/img/arrow-down.svg') center center no-repeat").css("background-size","55%");			
			}
			else {
				$("#mobile_filter_icon").css("background","url('assets/img/arrow-down.svg') center center no-repeat").css("background-size","55%");			
			}
			$("#select_box").hide()
			open = false;
		}
	})
}

function get_statistics(){
	window.addEventListener("keydown", function(e) {
		
		if(e.key == "s"){
			// console.log("statistics");

			let path = window.location.pathname;
			let year = parseInt($("#year option:selected").val());

			if (path.indexOf("avvisi") == -1 && path.indexOf("autori") == -1){ 
				the_path = "";
			}
			else {
				the_path = "../";
			}

			d3.tsv(the_path + "assets/data/voci_" + year + ".tsv").then(loaded)

			function loaded(data) {
				// console.log(data);

				let articles = 0;
				data.forEach(function (d,i) {
					articles += 1;
					d.size = +d.size;
				})

				let subject_group = d3.nest()
					.key(d => d.subject)
					.entries(data)

				console.group();
				console.log("articoli",articles)

				subject_group = subject_group.sort(function(x, y){
					return d3.descending(x.values.length, y.values.length);
				})

				subject_group.forEach(function (d,i) {
					console.log(d.key,d.values.length,precentage(d.values.length,articles))
				})

				// avg daily visit
				let avg_pv = d3.mean(data, function(d) { 
					return Math.round(d.avg_pv);
				})

				let avg_pv_prev = d3.mean(data, function(d) { 
					return Math.round(d.avg_pv_prev);
				})

				// size
				let avg_size = d3.mean(data, function(d) { 
					return d.size;
				})

				let avg_size_prev = d3.mean(data, function(d) { 
					return d.size_prev;
				})

				// incipit
				let avg_incipit = d3.mean(data, function(d) { 
					return d.incipit_size;
				})

				let avg_incipit_prev = d3.mean(data, function(d) { 
					return d.incipit_prev;
				})

				// discussion
				let avg_discussion = d3.mean(data, function(d) { 
					return d.discussion_size;
				})

				let avg_discussion_prev = d3.mean(data, function(d) { 
					return d.discussion_prev;
				})

				// issues
				let avg_issues = d3.mean(data, function(d) { 
					return d.issues;
				})

				let avg_issues_prev = d3.mean(data, function(d) { 
					return d.issues_prev;
				})

				// notes
				let avg_notes = d3.mean(data, function(d) { 
					return d.notes;
				})

				let avg_notes_prev = d3.mean(data, function(d) { 
					return d.notes_prev;
				})

				// images
				let avg_images = d3.mean(data, function(d) { 
					return d.images;
				})

				let avg_images_prev = d3.mean(data, function(d) { 
					return d.images_prev;
				})

				console.log("media visite giornaliere", Math.round(avg_pv), variation_perc(avg_pv,avg_pv_prev,"avg_pv"));

				console.log("media byte articolo", Math.round(avg_size), variation_perc(avg_size,avg_size_prev,"avg_size"));

				console.log("media byte incipit ", Math.round(avg_incipit), variation_perc(avg_incipit,avg_incipit_prev,"avg_incipit"));

				console.log("media byte pagina di discussione", Math.round(avg_discussion), variation_perc(avg_discussion,avg_discussion_prev,"avg_discussion"));

				console.log("media avvisi", parseFloat(avg_issues.toFixed(3)), variation_perc(avg_issues,avg_issues_prev,"avg_issues"));				

				console.log("media note", Math.round(avg_notes), variation_perc(avg_notes,avg_notes_prev,"avg_notes"));

				console.log("media immagini", Math.round(avg_images), variation_perc(avg_images,avg_images_prev,"avg_images"));
		
				console.groupEnd();
			}
		}
	})
}

function switch_the_language(){
	
}

function language() {
	const lang_button = document.getElementById("language");
	const lang_button_mobile = document.getElementById("language_mobile");
	let language_name = document.querySelectorAll(".language_name");

	let enContent = document.querySelectorAll(".en");
	let itContent = document.querySelectorAll(".it");

	let lang_switch = document.querySelectorAll(".lang_switch");
	let lang;

	lang_button.addEventListener("click", switch_language);
	lang_button_mobile.addEventListener("click", switch_language);

	// url
	const url = new URL(window.location.href);
	const base_url = location.protocol + '//' + location.host + location.pathname
	let params = new URLSearchParams(window.location.search);
	// console.log(base_url)

	function language_onload() {
		if (params.has('lang') == true) {
			lang = params.get('lang')
			// console.log(lang)

			if (lang == 'it') {
				lang = 'en'
			}
			else if (lang == 'en'){
				lang = 'it'
			}
			// console.log(lang)

			switch_language()
	  	}
	  	else {
	  		lang = "it"
	  	}
	}
	language_onload()

	function switch_language(){
		// update_footer();

		if (lang == "it") {

			lang = "en";

			// box with text
			enContent.forEach(box => {
				box.style.display = 'block';
			});
			itContent.forEach(box => {
				box.style.display = 'none';
			});

			// label
			language_name.forEach(box => {
				box.innerHTML = "IT";
			});

			// data attribute
			lang_switch.forEach(content => {
				let en = content.dataset.en
				let it = content.dataset.it

				content.textContent = en
			})
		} 
		else {
			
			lang = "it";

			// box with text
			enContent.forEach(box => {
				box.style.display = 'none';
			});
			itContent.forEach(box => {
				box.style.display = 'block';
			});

			// label
			language_name.forEach(box => {
				box.innerHTML = "EN";
			});

			// data attribute
			lang_switch.forEach(content => {
				let en = content.dataset.en
				let it = content.dataset.it

				content.textContent = it
			})
		}

		// url parameter
		params.set("lang", lang);
		newURL = base_url + "?lang=" + lang
		window.history.replaceState({}, '', newURL);

		path = window.location.pathname
		// console.log(path)

		if (path == '/_'){ // homepage
			update_dv1_lang(lang)
		}
		else if (path.indexOf('viste_') != -1){
			update_dv2_lang(lang)
		}
		else if (path.indexOf('avvisi_') != -1){
			update_dv3_lang(lang)
		}

		// if (path.indexOf('autori') == -1){
		// 	update_sidebar_text()
		// }

		// update stuff
		update_footer(lang)
		changeTitle(lang)
	}
}

function load_path(){
	const path = window.location.pathname

	if (path.indexOf("viste") == -1 && path.indexOf("avvisi") == -1){ 
		the_path = "";
	}
	else {
		the_path = "../";
	}
	return the_path
}

function load_footer(){

	let params = new URLSearchParams(window.location.search);
	if (params.has('lang') == true) {
		lang = params.get('lang')
	}
	
	let the_path = load_path()
	let footer_link = 'assets/content/footer.html'
	let url = the_path + footer_link;
	// console.log(the_path)
	
	fetch(url)
	    .then(response => {
	    	if (!response.ok) {
	        	throw new Error('Network response was not ok');
	    	}
	      	return response.text();
	    })
	    .then(data => {
	    	const tempElement = document.createElement('div');
      		tempElement.innerHTML = data;

      		footer_it = tempElement.querySelector('#footer_it');
      		footer_en = tempElement.querySelector('#footer_en');

      		if (lang == 'it'){
		      	the_footer = footer_it
      		}
	      	else {
      			the_footer = footer_en
      		}

		    footer.append(the_footer)
	    })
	    .catch(error => {
			console.error('There was a problem fetching the HTML:', error);
	    });
}
function update_footer(lang){	

	let new_footer;
	if (lang == 'it'){
		new_footer = footer_it
	}
	else {
		new_footer = footer_en
	}

	if (new_footer != undefined){
		footer.innerHTML = ''
		footer.append(new_footer)
	}
}

function changeTitle(lang) {
	const base = 'Wikipedia e luoghi della cultura italiana'
	let title = document.title
	let page = title.split(' | ')[0];
	let newTitle;

	switch (page) {
		case 'Autori e pubblicazioni':
			newTitle = 'Authors and publications'
			break;
		case 'Authors and publications':
			newTitle = 'Autori e pubblicazioni'
			break;

		case 'Voci con avvisi':
			newTitle = 'Articles with issues'
			break;
		case 'Articles with issues':
			newTitle = 'Voci con avvisi'
			break;

		case 'Voci più viste':
			newTitle = 'Most viewed articles'
			break;
		case 'Most viewed articles':
			newTitle = 'Voci più viste'
			break;

		default:
			newTitle = page;
	}
	document.title = newTitle + ' | ' + base;
}

function format_data(data){
	// console.log(data)

	const filteredData = data.filter(item => item.avg_pv !== 'ERRORE');

	filteredData.forEach(function (d,i) {
		d.article = d.article.replace(/_/g," ")
		d.size = +d.size
		d.discussion_size = +d.discussion_size
		d.incipit_size = +d.incipit_size
		d.avg_pv = +d.avg_pv
		d.avg_pv_prev = +d.avg_pv_prev
		d.issue_clarify = +d.issue_clarify
		d.days = +d.days

		if (d.references !== "-"){
			d.references = +d.references
		}
		else {
			d.references = 0
		}

		if (d.issues !== "-"){
			d.issues = +d.issues
		}
		else {
			d.issues = 0
		}

		if (d.notes !== "-"){
			d.notes = +d.notes
		}
		else {
			d.notes = 0
		}

		if (d.images !== "-"){
			d.images = +d.images
		}
		else {
			d.images = 0
		}
		
		d.features = d.references + d.notes + d.images;
	})
	return filteredData
}

function statistics(data){
	const statistics_box = document.getElementById('statistics')
	const analized_articles_box = document.getElementById('analized_articles')
	const avg_pv_articles_box = document.getElementById('avg_pv_articles')
	const avg_size_articles_box = document.getElementById('avg_size_articles')

	const analized_articles = data.length

	let sum_avg_pv = 0
	data.forEach(obj => sum_avg_pv += obj.avg_pv);
	const avg_pv_articles = Math.floor(sum_avg_pv / analized_articles)

	let sum_size = 0
	data.forEach(obj => sum_size += obj.size);
	const avg_size_articles = Math.floor(sum_size / analized_articles)

	analized_articles_box.innerHTML = analized_articles
	avg_pv_articles_box.innerHTML = avg_pv_articles
	avg_size_articles_box.innerHTML = avg_size_articles

	// function load_values(value){

	// 	let i = 0
	// 	let t = setInterval(function(){
	// 		if (i == analized_articles) clearInterval(t);
	// 		analized_articles_box.innerHTML = i++;
	// 	}, 1 );
	// }
	// load_values(analized_articles)
}

function get_tooltip(dv) {
	let tooltip = d3.tip()
		.attr('class', 'tooltip')
		.attr('id', 'tooltip_' + dv)
		.direction(function (d,i) {
			return 'n'
		})
		.html(function(d,i) {
			let params = new URLSearchParams(window.location.search);
			if (params.has('lang') == true) {
				lang = params.get('lang')
			}
			// console.log(lang)

			// lang = 'it'
			if (lang == 'it'){
				creation_date = "Voce creata il: "
				visits = "visite giornaliere"
				size = "dimensioni"
				discussion = "discussione"
				issues = "avvisi"
				images = "immagini"
				incipit = 'incipit'

				references = "riferimenti bibliog."
				notes = "note"
			}
			else {
				creation_date = "Created on: "
				visits = "daily visits"
				size = "size"
				discussion = "discussion"
				issues = "issues"
				images = "images"
				incipit = "lead section"

				references = "references"
				notes = "notes"
			}

			let content = ""
			// content += "<p style='color: red; margin: 0;'>" + i + "</p>" // debug  
			content += "<p style='font-weight: bold; margin: 0 0 .4rem .2rem;'>" + d.article + "</p>";
            content += "<p style='margin: 0 0 .8rem .2rem;'>" 
            // content += "<span>" + d.category + "</span><br>" // get_category(d.id_wikidata ,d.article, d.instances)
            content += "<span>" + creation_date + d.first_edit.slice(0,10) + "</span></p>" // format_date(d.first_edit) 

            content += '<hr style="border: 0.5px solid #e3e3e3"/>'

            content += '<table>'

            avg_daily_visits = ''
            avg_daily_visits += "<tr>"
			avg_daily_visits += "<td class='label'>" + visits + "</td>"
			avg_daily_visits += "<td class='value'>" + d.avg_pv.toLocaleString() + "</td>"
			avg_daily_visits += "<td></td>"
			avg_daily_visits += "</tr>"

            the_size = ''
			the_size += "<tr>"
			the_size += "<td class='label'>" + size + "<span style='color: #b9b9b9;'> (byte)</span></td>"
			the_size += "<td class='value'>" + d.size.toLocaleString() + "</td>"
			the_size += "<td></td>"
			the_size += "</tr>"

        	// the_incipit = ''
			// the_incipit += "<tr>"
			// the_incipit += "<td class='label'>" + incipit + "<span style='color: #b9b9b9;'> (byte)</span></td>"
			// the_incipit += "<td class='value'>" + d.incipit_size.toLocaleString() + "</td>"
			// the_incipit += "<td></td>"
			// the_incipit += "</tr>"

        	// the_discussion = ''
			// the_discussion += "<tr>"
			// the_discussion += "<td class='label'>" + discussion + "<span style='color: #b9b9b9;'> (byte)</span></td>"
			// the_discussion += "<td class='value'>" + d.discussion_size.toLocaleString() + "</td>"
			// the_discussion += "<td></td>"
			// the_discussion += "</tr>"

        	// the_issues = ''
			// the_issues += "<tr>"
			// the_issues += "<td class='label'>" + issues + "</td>"
			// the_issues += "<td class='value'>" + d.issues.toLocaleString() + "</td>"
			// the_issues += "<td></td>"
			// the_issues += "</tr>"

			// the_images = ''
			// the_images += "<tr>"
			// the_images += "<td class='label'>" + images + "</td>"
			// the_images += "<td class='value'>" + d.images.toLocaleString() + "</td>"
			// the_images += "<td></td>"
			// the_images += "</tr>"

			// the_references = ''
			// the_references += "<tr>"
			// the_references += "<td class='label'>" + references + "</td>"
			// the_references += "<td class='value'>" + d.references.toLocaleString() + "</td>"
			// the_references += "<td></td>"
			// the_references += "</tr>"		

			// the_notes = ''
			// the_notes += "<tr>"
			// the_notes += "<td class='label'>" + notes + "</td>"
			// the_notes += "<td class='value'>" + d.notes.toLocaleString() + "</td>"
			// the_notes += "<td></td>"
			// the_notes += "</tr>"

			if (dv == 'dv2') {
				content += avg_daily_visits
				content += the_size
				// content += the_incipit
				// content += the_discussion
				// content += the_issues
				// content += the_images
			}
			// else if (dv == 'dv3'){
			// 	content += avg_daily_visits
			// 	content += the_size
			// 	content += the_issues
			// 	content += the_references
			// 	content += the_notes
			// 	content += the_images
			// }

            content += "</table>"

            return content;
        });
	return tooltip
}

function isFloat(n){
	return Number(n) === n && n % 1 !== 0;
}

function filter_data(data){
	let filtered_data = data.filter(item => !(item.latitude === "Nessuna coordinata geografica")).filter(item => !(item.longitude === "Nessuna coordinata geografica")).filter(item => !(item.latitude === "Deprecated")).filter(item => !(item.longitude === "Deprecated")).filter(item => !(item.latitude === "")).filter(item => !(item.longitude === "")).filter(item => item.latitude % 1 !== 0).filter(item => item.longitude % 1 !== 0  )

	// data.filter(item => !(item.article_wikipedia === "Voce non esistente"))

	filtered_data.map(item => item.latitude = parseFloat(item.latitude))
	filtered_data.map(item => item.longitude = parseFloat(item.longitude))
	
	filtered_data.filter(item => item.latitude < 35).filter(item => item.longitude < 7)

	// console.log(filtered_data)
	return filtered_data
}

window.addEventListener('load', function () {    

	mobile_menu();
	mobile_filter();

	language();
	load_footer()	

	// get_statistics();
	
})

function tsvToGeoJSON(tsvText) {
	// console.log(tsvText)
    let lines = tsvText.split("\n"); // Split rows by newline
    let headers = lines[0].split("\t"); // Extract column names (first row)

    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    for (let i = 1; i < lines.length; i++) { 
        let values = lines[i].split("\t"); // Split columns by tab
        if (values.length < 3) continue; // Skip invalid rows

        let lon = parseFloat(values[6]);
        let lat = parseFloat(values[7]);
		// console.log(lat)

        if (!isNaN(lat) && !isNaN(lon) && lat != undefined && lat < 50 && lon < 50 ) { 
            geojson.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    "name": values[1], 
					"category": values[0],
					"link": values[4],
					"region" : values[15],
					"visitors": values[8],
					"public_private": values[9],
					"article_wikipedia": values[3]
                }
            });
        }
    }
    return geojson;
}

function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}