import { getLoggedInUser } from "../data/DataManager.js";

export const Post = (postObject) => {
  console.log(postObject);
  let thisPost = `
    <section class="post">
      <header>
          <h2 class="post__title">${postObject.title}</h2>
      </header>
      <div>
        <img class="post__image" src="${postObject.imageURL}" />
        <h4>${postObject.description}</h4>
        <h4>Author: ${postObject.user.name}</h4>
      </div>
      `;
  if (postObject.userId === getLoggedInUser().id) {
    thisPost += `<div>
      <button id="edit__${postObject.id}">Edit</button>
      <button id="delete__${postObject.id}">Delete</button></div>
  `;
  }
  thisPost += `</section>`;
  return thisPost;
};
