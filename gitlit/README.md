# GitLit

GitLit is a powerful VSCode extension designed to streamline your Git workflow. It simplifies the process of comparing code across different branches within the same project, providing a seamless experience for developers who need to review changes side by side.

## Features

- **Compare Branches Side by Side**: Open the same project in multiple VSCode windows to easily compare different branches.
- **Progress Reporting**: Get real-time progress updates while cloning repositories, fetching branches, and checking out branches.

## Installation

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

### From the Marketplace

1. Open VSCode.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for "GitLit".
4. Click "Install".

### From a VSIX File

1. Download the latest `.vsix` file from the [releases page](#).
2. Open VSCode.
3. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
4. Click on the three dots (...) at the top right of the Extensions view.
5. Choose "Install from VSIX..." and select the `.vsix` file you downloaded.

## Usage

1. Open your project in VSCode.
2. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Type `GitLit: Compare with Branch` and press `Enter`.
4. Enter the name of the branch you want to compare with and press `Enter`.
5. A new VSCode window will open with the specified branch checked out, and progress will be reported in real-time.

## Example

Here is an example of how to use GitLit to compare two branches:

1. Open your project in VSCode.
2. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
3. Run the `GitLit: Compare with Branch` command.
4. Enter `feature-branch` as the branch to compare with.
5. GitLit will clone the repository, fetch the branches, and check out `feature-branch` in a new window.

## Development

### Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **vsce**: Install the Visual Studio Code Extension Manager using npm:
    ```sh
    npm install -g vsce
    ```

### Build and Install from Source

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/gitlit.git
    cd gitlit
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Package the extension:
    ```sh
    vsce package
    ```
4. Install the generated `.vsix` file in VSCode:
    - Open VSCode.
    - Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
    - Click on the three dots (...) at the top right of the Extensions view.
    - Choose "Install from VSIX..." and select the generated `.vsix` file.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the [simple-git](https://github.com/steveukx/git-js) library for simplifying Git operations.
- Thanks to the VSCode team for their excellent documentation and APIs.
