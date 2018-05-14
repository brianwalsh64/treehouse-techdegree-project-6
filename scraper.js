const rp = require('request-promise');
const cheerio = require('cheerio');
const Json2csvParser = require('json2csv').Parser;
const fields = ['title', 'price', 'imgUrl', 'url', 'time'];
const fs = require('fs');
let mainURL = 'http://shirts4mike.com/';
let entryURL = 'http://shirts4mike.com/shirts.php';
let links = [];
let shirtData = [];
let allShirts = {};

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
        }// end links
      })// end each
      console.log('do first');
  })// end then
  .then(() => {scrape()})
  .then(() => {json2csv()})
  .catch((error) => {
    console.log(error);
  });

 /*Now, make another request to the server, actually eight request. Get price, title,
 imgURL, url and store in an array of objects, include the  time as well. */

function scrape() {
  for(i = 0; i < links.length; i++) {
    let url = `http://shirts4mike.com/${links[2].itemLink}`
      options = {
        uri: url,
        transform: function (body) {
          return cheerio.load(body);
        }// end transform
      };// end options
    rp(options)
      .then(($) => {
        let title = $('.shirt-details h1').text().slice(4);
        let price = $('.price').text();
        let imgURL = $('.shirt-picture img').attr('src');
        let time = new Date().toUTCString();
        allShirts = { 
          title: title,
          price: price,
          imgURL: imgURL,
          url: url,
          time: time,
        }
        shirtData.push(allShirts);
        //console.log(shirtData);
      })
      .catch((error) => {
        console.log(error);
      });
  }// end of for loop
  console.log('do second')

}//end scrape

/*Now, convert to and save in a .csv file and store that file the data folder*/
function json2csv() {
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(shirtData);
  console.log('do third')
  console.log(csv);
  console.log(allShirts);
  console.log(shirtData);
}// end json2csv
