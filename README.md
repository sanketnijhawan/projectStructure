# 📂 ProjectStructure

**ProjectStructure** is a web-based tool that allows you to visualize and explore the folder structure of a local directory or a GitHub repository. It provides a clean and interactive interface to view files and folders, ignore specific patterns, and copy the structure to your clipboard.

![ProjectStructure Screenshot](https://github.com/user-attachments/assets/fd9a7069-de5e-4724-b012-8ac98e0910f5)

---

## Features

- **Local Folder Upload**: Upload a folder from your local machine to visualize its structure.
- **GitHub Integration**: Enter a GitHub repository URL to fetch and display its folder structure.
- **Ignored Patterns**: Add or remove patterns to ignore specific files or folders (e.g., `node_modules`, `.git`).
- **Expand/Collapse Folders**: Easily expand or collapse folders to navigate the structure.
- **Copy Structure**: Copy the folder structure to your clipboard in a text format.
- **Statistics**: View the total number of files, folders, and file types.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.
  
![Screenshot 2025-02-01 024445](https://github.com/user-attachments/assets/af3be381-b213-40c5-aec6-df70a8101f07)

---

## How to Use

1. **Local Folder**:
   - Click the **📁 Choose Folder** button to upload a folder from your local machine.
   - The folder structure will be displayed automatically.

2. **GitHub Repository**:
   - Enter the GitHub repository URL in the input field (e.g., `https://github.com/user/repo`).
   - Click the **🌐 Generate Tree** button to fetch and display the repository's folder structure.

3. **Ignored Patterns**:
   - Add patterns (e.g., `node_modules`, `.git`) to ignore specific files or folders.
   - Click the **×** button next to a pattern to remove it.

4. **Expand/Collapse**:
   - Click on a folder to expand or collapse it.
   - Use the **⬇ Expand All** and **⬆ Collapse All** buttons to manage all folders at once.

5. **Copy Structure**:
   - Click the **📋 Copy All** button to copy the folder structure to your clipboard.

---

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ProjectStructure.git
   cd ProjectStructure
