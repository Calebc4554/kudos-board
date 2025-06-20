## Unit Assignment: Kudos Board

Submitted by: **Caleb Calderon**

Deployed Application (**required**): [Kudos Board Deployed Site](https://kudos-board-frontend-81nv.onrender.com/)

### Application Features

#### CORE FEATURES

##### Home Page

- [x] **Home Page Display**
  - [x] Home page includes the following features:
    - [x] Header
    - [x] Banner
    - [x] Search bar
    - [x] List of boards
    - [x] Footer
- [x] **Display Boards**    
  - [x] Users can view a list of all boards in a grid view on the home page.
  - [x] For each board displayed, users can see:
    - [x] An image/gif
    - [x] A board title
- [x] **Filter Boards**
  - [x] Home page includes navigation bar, drop down, or some other mechanism which allows users to filter boards by the following categories:
    - [x] All/Home (displays all boards)
    - [x] Recent (displays the 6 most recently created boards)
    - [x] Celebration
    - [x] Thank you
    - [x] Inspiration
  - [x] When a category is clicked, boards matching the specified category are displayed.
- [x] **Search Functionality**
  - [x] Users can use a search bar to search for boards by title on the home page.
  - [x] The search bar should include:
    - [x] Text input field
    - [x] Submit/Search Button
    - [x] Clear Mechanism
  - [x] Boards with a title containing the search query in the text input field are displayed in a grid view when the user:
    - [x] Presses the Enter key
    - [x] Clicks the Submit/Search button
  - [x] User can delete all text from the text input field.
  - [x] When all text is cleared from the text input field, all boards are displayed in a grid view
- [x] **View Board**
  - [x] Users can click on a board in the grid view to navigate to a new page containing that board's details.
- [x] **Add New Board**
  - [x] Users can create a new board on the home page.
  - [x] When creating a new board, users can specify the:
    - [x] Title (required)
    - [x] Category (required)
    - [x] Author (optional)
  - [x] Items listed as required above must have a value to succesffuly create a new board.
  - [x] When the board is successfully created, it appears in the grid of boards.
- [x] **Delete Board**
  - [x] User can delete boards on the home page.
  - [x] When the board is deleted, the board disappears from the grid of boards.

##### Board Page

- [x] **Display Cards**
  - [x] For a given board, the board's page displays a list of all cards for that board in a grid view.
  - [x] For each card should displayed, users can see the card's:
    - [x] Message
    - [x] Gif
    - [x] Number of upvotes
    - [x] Delete button
- [x] **Add New Card**
  - [x] Users can make a new card associated with the current board.
  - [x] To successfully create a new card, users must specify the following:
    - [x] Text message (required).
    - [x] A gif users can search for and select within the form using the [GIPHY API](https://developers.giphy.com/docs/api/) (required).
  - [x] Users are given the option to specify the author of the card.
  - [x] When the new card is successfully created, it appears in the grid of cards.
- [x] **Upvote Card**
  - [x] Users can upvote a card.
  - [x] Update the vote count on the card tile when a user clicks the upvote icon.
  - [x] When the upvote icon is clicked the upvote count increases by 1.
  - [x] A user can upvote a card multiple times.
- [x] **Delete Card**
  - [x] Users can delete cards.
  - [x] When the user clicks the delete button for a card, the card disappears from the grid of cards.
- [x] **Deployment**
  - [x] Website is deployed via Render.
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: For ease of grading, please use the deployed version of your website when creating your walkthrough.

#### Stretch Features

- [x] **Comments**
  - [x] Users can add comments to cards.
  - [x] To successfully add a comment, users must specify a text message body.
  - [x] Users are given the option to specify the author of the comment.
  - [x] Users can view comments on card in a pop-up modal that displays the card's:
    - [x] Text message
    - [x] Gif
    - [x] Author (if specified)
    - [x] A list of the card's comments and each comment's:
      - [x] Message body
      - [x] Author (if specified)
  - [x] Users can add multiple comments to a single card.
- [x] **Dark Mode**
  - [x] Users can toggle between light mode and dark mode using a button displayed on the:
    - [x] Home Page
    - [x] Board Pages
  - [x] When the button is clicked, the color theme switches to the opposite of the current mode.
  - [x] When dark mode is enabled:
    - [x] Text and icons use a light color
    - [x] The background uses a dark color
    - [x] Color contrast has at least a 4.5:1 ratio using this [color contrast checker](https://webaim.org/resources/contrastchecker/)
  - [x] When light mode is enabled:
    - [x] Text and icons use a dark color
    - [x] The background uses a light color
    - [x] Color contrast has at least a 4.5:1 ratio using this [color contrast checker](https://webaim.org/resources/contrastchecker/)
  - [x] The chosen mode (light or dark) persists when navigating from home page to board pages and vice versa.
  - [x] When the user first visits the site the theme defaults to light mode.
  - [x] **VIDEO WALKTHROUGH SPECIAL INSTRUCTIONS**: To ease the grading process, please use the [color contrast checker](https://webaim.org/resources/contrastchecker/) to demonstrate to the grading team that text and background colors on your website have appropriate contrast in both light and dark mode. The Contrast Ratio should be above 4.5:1 and should have a green box surrounding it.
- [x] **Pinned Cards**
  - [x] Users can pin a card to the top of the board.
  - [x] A Pin button is displayed on each card.
  - [x] When the user clicks the Pin button of an unpinned card:
    - [x] The card moves to the top of the grid view for that board.
    - [x] There is some visual feedback to indicate a card's pin status (e.g., a pin icon, a border highlight).
    - [x] The pin action is saved so that the card remains pinned after page refreshes.
  - [x] When the user clicks the Pin button of a pinned card:
    - [x] The card returns to its original position in the grid based on its creation time or to the end of the grid.
    - [x] The card's pin status (e.g., a pin icon or highlight) is removed.
    - [x] The unpin action is saved so that the card remains unpinned after page refresh.
  - [x] Pinned cards always appear at the top of the board, above unpinned cards.
  - [x] If multiple cards are pinned, they maintain their pinned order based on the time they were pinned.
    - [x] More recent pins should appear first.
- [x] The pinned state of a card persists when:
  - [x] navigating away from and back to the board.
  - [x] refreshing the page.

### Walkthrough Video

`https://www.loom.com/share/b135cb0fbb304f2499e06b15b04feec9?sid=6805b1a0-df3c-4aaa-97b5-dc50967880c9`

`ADD_EMBEDDED_CODE_HERE`

### Reflection

- Did the topics discussed in your labs prepare you to complete the assignment? Be specific, which features in your weekly assignment did you feel unprepared to complete?

I think the labs prepared me well in regards to creating the crud opperators but I think in general the backend was something that I had to really learn on my own and I dont think that that Labs were super effective 

- If you had more time, what would you have done differently? Would you have added additional features? Changed the way your project responded to a particular event, etc.

I think if I had more time I would have made my CSS a bit better and also looked for more edge cases to upgrade the user expierence.

- Reflect on your project demo, what went well? Were there things that maybe didn't go as planned? Did you notice something that your peer did that you would like to try next time?

I think that everything went pretty well i just dont think I had enough time to complete this along with all the other work that i had this week. If I could go back I saw that my peers skipped the labs and went straight to the project for more time and I potentially would have done that if I did this again.


### Open-source libraries used

React Router for client‐side routing - `https://reactrouter.com/`

Picsum Photos for placeholder images - `https://picsum.photos/`


### Shout out

Shout out to Terrance again he was really great peer mentor and very helpful. Also thank you to Noble Matthew he was a great help in teaching me the Pin card functionality.
