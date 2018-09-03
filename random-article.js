export let apiResults = [];
function fetchArticles(callback) {
  var url =
    "https://newsapi.org/v2/everything?" +
    "q=random&" +
    "from=2018-09-01&" +
    "language=en&" +
    "sortBy=popularity&" +
    "apiKey=c90697a593af42bf8619dffedeb7e06b";
  var req = new Request(url);
  fetch(req)
    .then(response => response.json())
    .then(response => {
      response.articles.forEach(el => apiResults.push(el.description));
      console.log(response);
    })
    .then(() => {
      callback();
    });
}

export default fetchArticles;
