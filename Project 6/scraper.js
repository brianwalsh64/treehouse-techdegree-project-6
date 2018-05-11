const rp = require('request-promise');
const cheerio = require('cheerio');
const json2csv = require('json2csv');
const fs = require('fs');
let mainURL = 'http://shirts4mike.com/';
let entryURL = 'http://shirts4mike.com/shirts.php';
let links = [];
let shirtData = [];
let allShirts = { };

/* check to see if the folder 'data' is there
if not, then creat it*/
if(fs.existsSync('./data')) {
	// do nothing
} else {
	fs.mkdirSync('./data');
}
/* First, create the option object to pass to 'request-promise', which makes the request
to the server. Then, get only the links from the UL on this page and store them 
in an array called 'links' as properties of an object. The links will be used to scrape
the rest of the data -(price, title, imgURL). */
let options = {
  uri: entryURL,
  transform: function (body) {
  	return cheerio.load(body);
  }
};
rp(options)
  .then( ($) => {
    $('.products li a').each(function(i, element) {
      links[i] = {
        itemLink: $(this).attr('href'),
      }
    })
  console.log(links);
  })
  .catch((error) => {
    console.log(error);
  });
/*So, the code above works fine, but the code below not so much. I dont get any error messages,
but I dont see my console.log() either. I tested the code below with a static hard coded array
of links and all works fine. I know this is some asynchronus issue, but i dont know how to fix it.
I watched the workshop video on Promises and looked at a bunch of stuff, but I am just lost at this
point. Could someone take a look? */
 /*Now, make another request to the server, actually eight request. Get price, title, imgURL 
 and store in an array of objects, include the  time as well. */
for(i = 0; i < links.length; i++) {
    options = {
      uri: `http://shirts4mike.com/${links[i].itemLink}`,
      transform: function (body) {
        return cheerio.load(body);
      }// end transform
    };// end options
  rp(options)
    .then(($) => {
      let price = $('.price').text();
      let title = $('.shirt-details h1').text().slice(4);
      let imgURL = $('.shirt-picture img').attr('src');
      let time = new Date().toUTCString();// check other formatts?
      allShirts = { 
        price: price,
        title: title,
        imgURL: imgURL,
        time: time,
      }
      console.log(allShirts);
      shirtData.push(allShirts);
      //console.log(shirtData);
    })
    .catch((error) => {
      console.log(error);
    });
}// end of for loop
    


