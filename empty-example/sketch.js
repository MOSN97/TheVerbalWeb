var loading = 0;
var transition = false;
var word_array = [];
var word_weigth_array = [];
var word_pos_array = [];
var search_array = [];
var search_title_array = [];
var search_pos_array = [];
var main_word = "Web";
var main_word_pos = [960, 420];
var main_word_size = 1.5;

function preload() {
  var url = "https://api.wordassociations.net/associations/v1.0/json/search?apikey=3f656073-1927-47ed-ba4b-aee3e9b7b271&text=Web&lang=en&type=stimulus&limit=16"
  loadJSON(url, wordAssociations);
  loadJSON("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI?rapidapi-key=112dee0dbamsh566862e33c248b7p19c882jsnf0a59bdb8dc8&pageNumber=1&q=Web&autoCorrect=false&pageSize=20", searchResults)
}

function setup() {
  createCanvas(1920, 1640);
  background(255);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  strokeWeight(2);
  var temp_search_pos = [670, 900]
  for (i = 0; i < 20; i++) {
    append(search_pos_array, temp_search_pos.slice())
    if (i % 2 == 0) {
      temp_search_pos[0] = 1250
    } else {
      temp_search_pos[0] = 670
      temp_search_pos[1] += 75
    }
  }
  console.log(search_pos_array)
  createWeb();
  // location.replace(search_array[0])
	// for (i = 0; i < word_array.length; i++) {
  //
	// }
}

function draw() {
  if (loading > 0 && main_word_size < 1.4995) {
    main_word_size += 0.1*(1.5 - main_word_size)
    if (main_word_size > 1.4995) {
      background(255)
    } else {
      background(255, 20*main_word_size)
    }
    main_word_pos[0] += 0.1*(960 - main_word_pos[0])
    main_word_pos[1] += 0.1*(420 - main_word_pos[1])
    fill(220, 255, 255);
    ellipse(main_word_pos[0], main_word_pos[1], 110*main_word_size, 70*main_word_size);
    fill(0);
    textSize(16*main_word_size);
    textStyle(BOLD);
    text(main_word, main_word_pos[0], main_word_pos[1]);
  }
}

function wordAssociations(data) {
 word_array = [];
 word_weigth_array = [];
 word_pos_array = [];
 console.log(data)
 shuffle(data.response[0].items, true)
 for (i = 0; i < data.response[0].items.length; i++) {
	 append(word_array, data.response[0].items[i].item);
   append(word_weigth_array, data.response[0].items[i].weight);
 }
 if (loading == 1) {
   main_word_pos = [960, 420];
   createWeb()
 }
 loading -= 1;
}

function searchResults(data) {
  search_title_array = [];
  search_array = [];
  console.log(data)
  for (i = 0; i < data.value.length; i++) {
    append(search_title_array, data.value[i].title)
    append(search_array, data.value[i].url)
  }

  if (loading == 1) {
    main_word_pos = [960, 420];
    createWeb()
  }
  loading -= 1;
}

function mouseClicked() {
  if (loading > 0) {
    return
  }
  for (i = 0; i < word_array.length; i++) {
    if (Math.sqrt(Math.pow(word_pos_array[i][0] - mouseX, 2) + Math.pow(word_pos_array[i][1] - mouseY, 2)) < 50) {
      loading = 2
      main_word = word_array[i]
      main_word_pos = word_pos_array[i]
      main_word_size = 1
      loadJSON("https://api.wordassociations.net/associations/v1.0/json/search?apikey=3f656073-1927-47ed-ba4b-aee3e9b7b271&text=" + main_word + "&lang=en&type=stimulus&limit=16", wordAssociations);
      loadJSON("https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI?rapidapi-key=112dee0dbamsh566862e33c248b7p19c882jsnf0a59bdb8dc8&pageNumber=1&q=" + main_word + "&autoCorrect=false&pageSize=20", searchResults)
      return
    }
  }
  for (i = 0; i < search_array.length; i++) {
    if (Math.abs(search_pos_array[i][0] - mouseX) < 270 && Math.abs(search_pos_array[i][1] - mouseY) < 30) {
      location.replace(search_array[i])
      return
    }
  }
}

function createWeb() {
  background(255)
  textStyle(BOLD);
  for (i = 0; i < word_array.length; i++) {
		var angle = (360/word_array.length*i)*Math.PI/180
    var length = 390 - word_weigth_array[i]*1.5
    word_pos_array[i] = [main_word_pos[0] + length*Math.cos(angle), main_word_pos[1] + length*Math.sin(angle)]
    line(main_word_pos[0], main_word_pos[1], word_pos_array[i][0], word_pos_array[i][1]);
    fill(220, 255, 255);
    ellipse(word_pos_array[i][0], word_pos_array[i][1], 110, 70);
    fill(0);
    textSize(16);
    text(word_array[i], word_pos_array[i][0], word_pos_array[i][1]);
	}
  fill(220, 255, 255);
  ellipse(main_word_pos[0], main_word_pos[1], 165, 105);
  fill(0);
  textSize(24);
  text(main_word, main_word_pos[0], main_word_pos[1]);
  fill(240);
  rect(960, 1235, 1180, 790)
  fill(0);
  textSize(12);
  text("Showing search results for '" + main_word + "'", 960, 850)
  textStyle(NORMAL);
  for (i = 0; i < search_array.length; i++) {
    fill(255, 255, 255);
    rect(search_pos_array[i][0], search_pos_array[i][1], 540, 60)
    fill(5, 99, 193)
    textSize(20);
    if (search_title_array[i].length < 58) {
      text(search_title_array[i], search_pos_array[i][0], search_pos_array[i][1] - 12)
    } else {
      text(search_title_array[i].substring(0, 54) + "...", search_pos_array[i][0], search_pos_array[i][1] - 12)
    }
    fill(0)
    textSize(14);
    if (search_array[i].length < 80) {
      text(search_array[i], search_pos_array[i][0], search_pos_array[i][1] + 15)
    } else {
      text(search_array[i].substring(0, 76) + "...", search_pos_array[i][0], search_pos_array[i][1] + 15)
    }
  }
}
