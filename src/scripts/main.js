// Can you explain what is being imported here?
import { PostList } from "./feed/PostList.js";
import { NavBar } from "./nav/NavBar.js";
import { Footer } from "./nav/Footer.js";
import {
  usePostCollection,
  createPost,
  getPosts,
  getUsers,
  getLoggedInUser,
  getLoggedInUserPosts,
  deletePost,
  getSinglePost,
  updatePost,
  setLoggedInUser,
  loginUser,
  logoutUser,
} from "./data/DataManager.js";
import { PostEntry } from "./feed/PostEntry.js";
import { PostEdit } from "./feed/PostEdit.js";
import { LoginForm } from "./auth/LoginForm.js";
import { RegisterForm } from "./auth/RegisterForm.js";

const showPostList = () => {
  //Get a reference to the location on the DOM where the list will display
  const postElement = document.querySelector(".postList");
  showPostEntry();
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
  if (event.target.id === "home__button") {
    alert("Home Button Pressed");
  } else if (event.target.id === "showMyPosts") {
    const postElement = document.querySelector(".postList");
    showPostEntry();
    getLoggedInUserPosts().then((allPosts) => {
      postElement.innerHTML = PostList(allPosts);
    });
  } else if (event.target.id === 'showAllPosts') {
    startGiffyGram();
  } else if (event.target.id.startsWith("edit")) {
    console.log("post clicked", event.target.id.split("--"));
    console.log("the id is", event.target.id.split("--")[1]);
  } else if (event.target.id === "newPost__cancel") {
    showPostEntry();
  } else if (event.target.id === "logout") {
    logoutUser();
    console.log(getLoggedInUser());
    sessionStorage.clear();
    checkForUser();
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
  } else if (event.target.id === "login__submit") {
    //collect all the details into an object
    const userObject = {
      name: document.querySelector("input[name='name']").value,
      email: document.querySelector("input[name='email']").value,
    };
    loginUser(userObject).then((dbUserObj) => {
      if (dbUserObj) {
        sessionStorage.setItem("user", JSON.stringify(dbUserObj));
        startGiffyGram();
      } else {
        //got a false value - no user
        const entryElement = document.querySelector(".entryForm");
        entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
      }
    });
  } else if (event.target.id === "register__submit") {
    //collect all the details into an object
    const userObject = {
      name: document.querySelector("input[name='registerName']").value,
      email: document.querySelector("input[name='registerEmail']").value,
    };
    registerUser(userObject).then((dbUserObj) => {
      sessionStorage.setItem("user", JSON.stringify(dbUserObj));
      startGiffyGram();
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
  if (sessionStorage.getItem("user")) {
    setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
    startGiffyGram();
  } else {
    showLoginRegister();
  }
};

const showLoginRegister = () => {
  showNavBar();
  const entryElement = document.querySelector(".entryForm");
  //template strings can be used here too
  entryElement.innerHTML = `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
  //make sure the post list is cleared out too
  const postElement = document.querySelector(".postList");
  postElement.innerHTML = "";
};

checkForUser();
