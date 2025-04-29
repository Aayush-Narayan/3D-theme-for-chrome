# 3D-theme-for-chrome
This JavaScript code uses **Three.js** to create a 3D interactive UI with animated geometric graphs based on virtual windows. It includes a **search widget**, a **shortcut bar** with quick links, and smooth animations. The scene responds to mouse movements, with idle animations after 5 seconds of inactivity.
Here is a `README.md` file for your project:

```markdown
# 3D New Tab Theme Chrome Extension

A Chrome extension that replaces your new tab page with a custom 3D scene. The scene features animated cubes and dynamic window management using **Three.js**. It tracks window sizes and positions and stores them in **localStorage**.

## Features

- **Custom 3D Background**: Displays animated cubes and dynamic visuals when opening a new tab.
- **Window Management**: Tracks and saves window positions and sizes, updates across sessions.
- **Interactive UI**: The scene reacts to window size changes and smooth animations.
- **Idle Detection**: Animations change when the user is idle.

## Installation

1. **Download or Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/3d-new-tab-theme.git
   ```

2. **Open Chrome** and go to `chrome://extensions/`.

3. **Enable Developer Mode** (top-right).

4. **Click 'Load unpacked'** and select the project folder.

5. **Open a New Tab** to see the 3D scene in action.

## File Structure

```
3d-new-tab-theme/
├── manifest.json            # Extension manifest file
├── index.html               # HTML for the new tab page
├── main.js                  # Main JavaScript file with Three.js logic
├── WindowManager.js         # Window management class
├── .gitignore               # Git ignore file
└── README.md                # Project README
```

## Permissions

- The extension uses no special permissions except for controlling the new tab page.

## How It Works

- **`manifest.json`**: Configures the Chrome extension to override the new tab with a custom page (`index.html`).
- **`index.html`**: Sets up the HTML structure for the new tab, loads Three.js, and includes `main.js` for 3D rendering.
- **`WindowManager.js`**: A custom JavaScript class that manages window size and position, storing and syncing data across sessions using `localStorage`.

## Key Functions

- **`WindowManager`**: Tracks window position and size, updating them in `localStorage`. It ensures that changes to window dimensions persist between sessions.
- **Three.js 3D Scene**: Animates cubes and creates dynamic visuals in the background using Three.js.

## Customization

- You can modify the **3D scene** in `main.js` by changing the objects, animations, or adding new elements.
- Update the **new tab UI** by customizing `index.html` and the associated CSS.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Three.js](https://threejs.org/) - 3D JavaScript library.
- [Font Awesome](https://fontawesome.com/) - Icons used in the shortcut bar.
```

This `README.md` provides an overview of your project, installation instructions, and usage details, along with a brief explanation of how the components work together. You can modify it further if you need more specifics about the functionality.
