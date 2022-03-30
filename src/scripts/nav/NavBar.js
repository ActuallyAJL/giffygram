export const NavBar = () => {
  return `
        <nav class="navigation">
            <div class="navigation__item navigation__icon" id='home__button'>
                <img id='home__button' src="./images/pb.png" alt="Giffygram icon" />
            </div>
            <div class="navigation__item navigation__name">
                Giffygram
            </div>
            <div class="navigation__item navigation__search">
                <input type="text" id="postSearch" placeholder="Search posts..." />
            </div>
            <div>
                <button class="navigation__item" id="showMyPosts">Show My Posts<button>
                <button class="navigation__item" id="showAllPosts">Show All Posts<button>
            </div>
            <div class="navigation__item navigation__message">
                <img id="directMessageIcon" src="./images/fountain-pen.svg" alt="Direct message" />
            </div>
            <div class="navigation__item navigation__logout">
                <button id="logout" class="fakeLink">Logout</button>
            </div>
        </nav>
    `;
};
