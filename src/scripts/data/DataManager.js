const userSrc = "http://localhost:8088/users";
const postSrc = "http://localhost:8088/posts";

export const getUsers = () => {

    return fetch(userSrc)
    .then(response => response.json())
    .then(parsedResponse => {
        // do something with response here
        return parsedResponse;
    })
}

export const getPosts = () => {

    return fetch(postSrc)
    .then(response => response.json())
    .then(parsedResponse => {
        // do something with response here
        return parsedResponse;
    })
}

const loggedInUser = {
	id: 2,
	name: "Alex Levy",
	email: "alex.j.levy@me.com"
}

export const getLoggedInUser = () => {
	return loggedInUser;
}