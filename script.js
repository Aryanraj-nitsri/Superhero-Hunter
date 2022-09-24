
const publicKey = "263c9e44a50eecd7abd51e8a1d2209afd40de610";
const url =
  "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=ec3849badb96d2b26ee646d5e8007484&hash=2e10f0ccbb358a2583a1f31566b4d1e4 ";


// two pages of website and initial content to render 
const pages = {
  home: `<div class="mx-auto mt-5" ><div class="spinner-border text-white"style="width: 7rem; height: 7rem;" role="status">
    <span class="visually-hidden">Loading...</span>
  </div></div>`,
  favourite: `<p class="text-white">Your favourite is empty</p>`,
};

let appData = [];
let favouriteMoiveList = [];
let favouriteMovieData = "";

// for loading content of different pages 
function loadContent() {
  var root = document.getElementById("root"),
    fragmentId = location.hash.slice(1);
  if (fragmentId === "favourite") {
    root.innerHTML = pages[fragmentId];

    let unfavButton = document.querySelectorAll(".unfavButton");
    if (unfavButton) {
      for (let button of unfavButton) {
        button.addEventListener(
          "click",
          (e) => {
            let index = favouriteMoiveList.indexOf(
              e.target.parentElement.firstElementChild.innerText
            );

            favouriteMoiveList.splice(index, 1);
            window.localStorage.setItem(
              "favData",
              JSON.stringify(favouriteMoiveList)
            );
            window.location.reload();
          },
          false
        );
      }
    }
  } else {
    root.innerHTML = pages[fragmentId];
  }
}

if (!location.hash) {
  location.hash = "#home";
}

loadContent();

window.addEventListener("hashchange", loadContent);// added hash eventlistener to route between pages
window.onload = async () => {
  // getting all the data of super hero from fetch api
  let response = await fetch(url);
  let responsedPromise = response.json();
  let result = await responsedPromise;
  let data = result.data.results;
  appData = [...data];
  let homeData = "";
  data.forEach((element) => {
// home page content 
    homeData += `<div class="card border border-5 border-dark bg-transparent text-white flex-grow-1" style="width: 18rem;">
        <img src=${element.thumbnail.path
      }/portrait_xlarge.jpg class="card-img-top" alt="..." style="height:15rem">
        <div class="card-body d-flex flex-column align-items-center gap-2">
          <h5 class="card-title "style="color:  #adb5bd;" >${element.name}</h5>
         
          <span class="text-danger">Series: <span class="text-white">${element.series.available
      }</span></span>
          <span class="text-danger">Stories: <span class="text-white">${element.stories.available
      }</span></span>
          <a href=${element.urls[2] ? element.urls[2].url : "..."
      } class="btn btn-dark bg-opacity-25" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
      }</span></span></a>
          <a href=${element.urls[0].url
      } class="btn btn-dark bg-opacity-25" style="width:90%;" target="_blank">More Detail</a>
            </div>
      </div>`;
  });
  // favourite page content 
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));
  if (savedLocalFavData !== null && savedLocalFavData.length > 0) {
    favouriteMoiveList = savedLocalFavData;
    data.forEach((element) => {
      for (let item of savedLocalFavData) {
        if (element.name === item) {
          favouriteMovieData += `<div class="card  border border-5 border-dark bg-transparent text-white " style="width: 18rem;">
      <img src=${element.thumbnail.path
            }/portrait_xlarge.jpg class="card-img-top" alt="..." style="height:15rem">
      <div class="card-body d-flex flex-column align-items-center gap-2">
        <h5 class="card-title text-light">${element.name}</h5>
       
        <span class="text-danger">Series: <span class="text-white">${element.series.available
            }</span></span>
        <span class="text-danger">Stories: <span class="text-white">${element.stories.available
            }</span></span>
        <a href=${element.urls[2] ? element.urls[2].url : "..."
            } class="btn btn-dark" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
            }</span></span></a>
        <a href=${element.urls[0].url
            } class="btn btn-dark" style="width:90%" target="_blank">More Detail</a>
        <a
            
           class="btn btn-dark unfavButton" style="width:90%" >unfavourite</a>
          </div>
    </div >; `;
        }
      }
    });
    pages["favourite"] = favouriteMovieData;
  }

  pages["home"] = homeData;
  loadContent();
};

// handling search bar in nav 

const searchText = document.getElementById("searchText");
const searchCard = document.getElementById("searchCard");
searchText.addEventListener("input", function handleSearch(e) {
  searchCard.innerHTML = "";
  searchCard.style.height = "0";

  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));
  let value = e.target.value;
  let emptyData = [];
  if (value) {
    searchCard.style.height = "200px";
    let SuggestedData = appData.map((item) => {
      return { name: item.name, url: item.urls[0].url };
    });
    emptyData = SuggestedData.filter((item) => {
      return item.name.toLowerCase().startsWith(value.toLowerCase());
    });
    if (emptyData[0]) {
      emptyData.forEach((item) => {
        let flag = false;
        if (savedLocalFavData) {
          for (let data of savedLocalFavData) {
            flag = item.name === data;
            if (flag) {
              break;
            }
          }
        }

        searchCard.innerHTML += `<li class="d-flex justify-content-between align-items-center border-bottom"> <a href=${item.url
          } class="text-decoration-none text-danger" style="font-size:15px" target="_blank">${item.name
          }</a>
                      <button type="button" class="btn btn-link text-white fav-button"  
            >${flag ? "unfavourite" : "Add to Favourite"} </button></li>`;
      });
      let buttons = document.querySelectorAll(".fav-button");

      for (let button of buttons) {
        button.addEventListener("click", (e, item) => {
          handleFav(e, item);
        });
      }
    } else {
      searchCard.innerHTML = `<p style="text-align:center;margin-top:25%" class="text-white">No result </p>`;
    }
  }
});

// handling favourite and unfavourite from search bar
function handleFav(e, item) {
  favouriteMovieData = "";
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));

  let index = favouriteMoiveList.indexOf(
    e.target.previousElementSibling.innerText
  );
  if (index === -1) {
    favouriteMoiveList.push(e.target.previousElementSibling.innerText);
    window.localStorage.setItem("favData", JSON.stringify(favouriteMoiveList));
    savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));

    e.target.innerText = "unfavourite";
    appData.forEach((element) => {
      for (let item of savedLocalFavData) {
        if (element.name === item) {
          favouriteMovieData += `<div class="card bg-dark text-white " style="width: 18rem;">
        <img src=${element.thumbnail.path
            }/portrait_xlarge.jpg class="card-img-top" alt="..." style="height:15rem">
        <div class="card-body d-flex flex-column align-items-center gap-2">
          <h5 class="card-title text-danger">${element.name}</h5>
         
          <span class="text-danger">Series: <span class="text-white">${element.series.available
            }</span></span>
          <span class="text-danger">Stories: <span class="text-white">${element.stories.available
            }</span></span>
          <a href=${element.urls[2] ? element.urls[2].url : "..."
            } class="btn btn-danger" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
            }</span></span></a>
          <a href=${element.urls[0].url
            } class="btn btn-danger" style="width:90%" target="_blank">More Detail</a>
          <a 
           class="btn btn-danger unfavButton" style="width:90%" >unfavourite</a>
            </div>
      </div >; `;
        }
      }
    });

    pages["favourite"] = favouriteMovieData;
    if (window.location.hash.slice(1) === "favourite") {
      loadContent();
    }
  } else if (index !== -1) {
    savedLocalFavData.splice(index, 1);
    window.localStorage.setItem("favData", JSON.stringify(savedLocalFavData));
    e.target.innerText = "favourite";
    window.location.reload();
  }
}
// end 