// Can you explain what is being imported here?
import { PostList } from "./feed/PostList.js";
import { NavBar } from "./nav/NavBar.js";
import { Footer } from "./nav/Footer.js";
import {
  usePostCollection,
  createPost,
  getPosts,
  getUsers, getLoggedInUser,
  deletePost,
  getSinglePost, updatePost, setLoggedInUser
} from "./data/DataManager.js";
import { PostEntry } from "./feed/PostEntry.js";
import { PostEdit } from "./feed/PostEdit.js";

const showPostList = () => {
  //Get a reference to the location on the DOM where the list will display
  const postElement = document.querySelector(".postList");
  getPosts().then((allPosts) => {
    postElement.innerHTML = PostList(allPosts);
  });
};

const showNavBar = () => {
  //Get a reference to the location on the DOM where the nav will display
  const navElement = document.querySelector("nav");
  navElement.innerHTML = NavBar();
};

const showFooter = () => {
  //Get a reference to the location on the DOM where the nav will display
  const footElement = document.querySelector("footer");
  footElement.innerHTML = Footer();
};

const startGiffyGram = () => {
  showNavBar();
  showPostList();
  showFooter();
};

const applicationElement = document.querySelector(".giffygram");

applicationElement.addEventListener("click", (event) => {
  if (event.target.id === "logout") {
    logoutUser();
    console.log(getLoggedInUser());
  } else if (event.target.id === "home__button") {
    alert("Home Button Pressed");
  } else if (event.target.id.startsWith("edit")) {
    console.log("post clicked", event.target.id.split("--"));
    console.log("the id is", event.target.id.split("--")[1]);
  }
});

applicationElement.addEventListener("change", (event) => {
  if (event.target.id === "yearSelection") {
    const yearAsNumber = parseInt(event.target.value);
    console.log(`User wants to see posts since ${yearAsNumber}`);
    //invoke a filter function passing the year as an argument
    showFilteredPosts(yearAsNumber);
  }
});

const showFilteredPosts = (year) => {
  //get a copy of the post collection
  const epoch = Date.parse(`01/01/${year}`);
  //filter the data
  const filteredData = usePostCollection().filter((singlePost) => {
    if (singlePost.timestamp >= epoch) {
      return singlePost;
    }
  });
  const postElement = document.querySelector(".postList");
  postElement.innerHTML = PostList(filteredData);
};

applicationElement.addEventListener("click", (event) => {
  if (event.target.id === "newPost__cancel") {
    //clear the input fields
  }
});

applicationElement.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.id === "newPost__submit") {
    //collect the input values into an object to post to the DB
    const title = document.querySelector("input[name='postTitle']").value;
    const url = document.querySelector("input[name='postURL']").value;
    const description = document.querySelector(
      "textarea[name='postDescription']"
    ).value;
    //we have not created a user yet - for now, we will hard code `1`.
    //we can add the current time as well
    const postObject = {
      title: title,
      imageURL: url,
      description: description,
      userId: 1,
      timestamp: Date.now(),
    };

    // be sure to import from the DataManager
    createPost(postObject);
  } else if (event.target.id.startsWith("delete")) {
    const postId = event.target.id.split("__")[1];
    deletePost(postId).then((response) => {
      showPostList();
    });
  } else if (event.target.id.startsWith("edit")) {
    const postId = event.target.id.split("__")[1];
    getSinglePost(postId).then((response) => {
      showEdit(response);
    });
  } else if (event.target.id.startsWith("updatePost")) {
    const postId = event.target.id.split("__")[1];
    //collect all the details into an object
    const title = document.querySelector("input[name='postTitle']").value;
    const url = document.querySelector("input[name='postURL']").value;
    const description = document.querySelector(
      "textarea[name='postDescription']"
    ).value;
    const timestamp = document.querySelector("input[name='postTime']").value;

    const postObject = {
      title: title,
      imageURL: url,
      description: description,
      userId: getLoggedInUser().id,
      timestamp: parseInt(timestamp),
      id: parseInt(postId),
    };

    updatePost(postObject).then((response) => {
      showPostList();
    });
  }
});

const showEdit = (postObj) => {
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEdit(postObj);
};

const showPostEntry = () => {
  //Get a reference to the location on the DOM where the nav will display
  const entryElement = document.querySelector(".entryForm");
  entryElement.innerHTML = PostEntry();
};

const checkForUser = () => {
  if (sessionStorage.getItem("user")){
    setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
    startGiffyGram();
    showPostEntry();
  }else {
    //show login/register
    console.log("showLogin")
  }
}

// showPostEntry();
checkForUser();
