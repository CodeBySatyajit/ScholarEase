
const apiKey = window.NEWS_API_KEY || '';
const url = `https://gnews.io/api/v4/search?q=scholarship%20education&lang=en&max=50&apikey=${apiKey}`;

fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        const newsContainer = document.querySelector("#news-track") || document.querySelector(".section2-2");


        data.articles.forEach((article) => {
            let newsCard = document.createElement("div");
            newsCard.className = "section2-card-news"; 
            newsCard.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${article.image || 'https://via.placeholder.com/640x360'}" alt="News Image" class="section2-card-news-image"/>
                    <div class="card-badge">Latest</div>
                </div>
                <div class="section2infodiv">
                    <h5 class="section2-card-title">${article.title.substring(0, 40)}...</h5>
                    <p class="p00">${article.description?.substring(0, 80) || 'Read the full article for more details'}...</p>
                    <p class="p11"> <b>Source: </b>${article.source.name}</p>
                    <p>Date: ${new Date(article.publishedAt).toLocaleDateString()}</p>
                    <button class="read-more-btn" onclick="window.open('${article.url}', '_blank')">Read More</button>
                </div>
            `;
            newsContainer.appendChild(newsCard);
        });

    })
    .catch((error) => {
        console.log("Error fetching news:", error);
    }); 