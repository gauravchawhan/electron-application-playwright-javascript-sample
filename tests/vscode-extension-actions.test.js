import { _electron as electron, expect, test } from '@playwright/test';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Platform-specific keyboard shortcuts
const shortcuts = {
  // Command Palette
  commandPalette: process.platform === 'darwin' ? 'Meta+Shift+P' : 'Control+Shift+P',
  
  // File operations
  newFile: process.platform === 'darwin' ? 'Meta+N' : 'Control+N',
  openFile: process.platform === 'darwin' ? 'Meta+O' : 'Control+O',
  saveFile: process.platform === 'darwin' ? 'Meta+S' : 'Control+S',
  
  // Navigation
  quickOpen: process.platform === 'darwin' ? 'Meta+P' : 'Control+P',
  goToLine: process.platform === 'darwin' ? 'Meta+G' : 'Control+G',
  
  // Views
  explorer: process.platform === 'darwin' ? 'Meta+Shift+E' : 'Control+Shift+E',
  search: process.platform === 'darwin' ? 'Meta+Shift+F' : 'Control+Shift+F',
  sourceControl: process.platform === 'darwin' ? 'Meta+Shift+G' : 'Control+Shift+G',
  extensions: process.platform === 'darwin' ? 'Meta+Shift+X' : 'Control+Shift+X',
  
  // Text editing
  selectAll: process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
  endOfFile: process.platform === 'darwin' ? 'Meta+End' : 'Control+End',
  beginningOfFile: process.platform === 'darwin' ? 'Meta+Home' : 'Control+Home',
  
  // General
  enter: 'Enter',
  tab: 'Tab',
  escape: 'Escape'
};

test('Creating a new file', async () => {
  // Adjust path for your OS

  console.log(process.platform);
  const vscodePath =
    process.platform === 'darwin'
      ? '/Applications/Visual Studio Code.app/Contents/MacOS/Electron'
      : process.platform === 'win32'
      ? 
       'C:\\\\Program Files\\\\Microsoft VS Code\\\\Code.exe'
     //'C:\\\\Users\\\\ltuser.ghtestVM\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe'
       //'C:\\\\Users\\\\gauravc\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe'
      : '/usr/share/code/code';

  // Launch VS Code with current folder
  const currentDir = process.cwd();
  console.log("Opening folder:", currentDir);
  const app = await electron.launch({ 
    executablePath: vscodePath,
    args: [currentDir, '--disable-workspace-trust'] // Open current folder
  });
 

  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  
  // Maximize the window using Playwright
  await window.evaluate(() => {
    if (window.electronAPI && window.electronAPI.maximize) {
      window.electronAPI.maximize();
    } else {
      // Fallback: try to maximize using browser APIs
      window.moveTo(0, 0);
      window.resizeTo(screen.width, screen.height);
    }
  });
  
  // Wait for VS Code to fully initialize and load the folder
  await window.waitForTimeout(5000);
  console.log("VS Code launched and folder loaded");

  // Verify title
  const title = await window.title();
  console.log("Window title:", title);
 
  // 1. Create new file using platform-specific shortcut
  console.log("Creating new file");
  await window.keyboard.press(shortcuts.newFile);
  await window.waitForTimeout(2000);

  console.log("Typing hello world");
  // 2. Type some text
  await window.keyboard.type('hello world');
  await window.waitForTimeout(2000);

  // 3. Save file using robotjs
  // console.log("Saving File");
  // await saveNewFile(window, currentDir);
  // Close VS Code
  await app.close();
});

test('Open testing.txt, add content, save and move to demo folder', async () => {
  // Adjust path for your OS
  console.log(process.platform);
  const vscodePath =
    process.platform === 'darwin'
      ? '/Applications/Visual Studio Code.app/Contents/MacOS/Electron'
      : process.platform === 'win32'
      ? 'C:\\\\Program Files\\\\Microsoft VS Code\\\\Code.exe'
      //'C:\\\\Users\\\\ltuser.ghtestVM\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe'
       //'C:\\\\Users\\\\gauravc\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe'
      : '/usr/share/code/code';

  // Launch VS Code with current folder
  const currentDir = process.cwd();
  console.log("Opening folder:", currentDir);
  const app = await electron.launch({ 
    executablePath: vscodePath,
    args: [currentDir, '--disable-workspace-trust'] // Open current folder
  });


  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  
  // Maximize the window using Playwright
  await window.evaluate(() => {
    if (window.electronAPI && window.electronAPI.maximize) {
      window.electronAPI.maximize();
    } else {
      // Fallback: try to maximize using browser APIs
      window.moveTo(0, 0);
      window.resizeTo(screen.width, screen.height);
    }
  });
  
  // Wait for VS Code to fully initialize and load the folder
  await window.waitForTimeout(5000);
  console.log("VS Code launched and folder loaded");

  // 1. Open existing testing.txt file using Command Palette
  console.log("Opening Command Palette to open existing testing.txt");
  await window.keyboard.press(shortcuts.commandPalette);
  await window.waitForTimeout(2000);
  
  // Type "Open File" command
  console.log("Typing Open File command");
  await window.keyboard.press(shortcuts.quickOpen);
  await window.waitForTimeout(2000);
  
  // Type the filename
  console.log("Typing testing.txt filename");
  await window.keyboard.type('testing.txt');
  await window.waitForTimeout(1000);
  await window.keyboard.press(shortcuts.enter);
  await window.waitForTimeout(2000);

  // 2. Add content to the file
  console.log("Adding content to testing.txt");
  // Move cursor to end of file
  await window.keyboard.press(shortcuts.endOfFile);
  await window.waitForTimeout(500);
  // Add new line and content
  await window.keyboard.press(shortcuts.enter);
  await window.keyboard.type('test sample test');
  await window.waitForTimeout(2000);

  // 3. Save the file
  console.log("Saving the file");
  await window.keyboard.press(shortcuts.saveFile);
  await window.waitForTimeout(2000);

  // 4. Move testing.txt to existing demo folder
  console.log("Moving testing.txt to existing demo folder");
  
  // Use Command Palette to move file
  await window.keyboard.press(shortcuts.commandPalette);
  await window.waitForTimeout(2000);
  
  await window.keyboard.type('View: Show Explorer');
  await window.keyboard.press(shortcuts.enter);
  // Use platform-specific rename shortcut
  const renameKey = process.platform === 'darwin' ? 'Enter' : 'F2';
  await window.keyboard.press(renameKey);
  await window.waitForTimeout(1000);
  
  // Type destination path to existing demo folder
  await window.keyboard.type('demo/testing');
  await window.waitForTimeout(1000);
  await window.keyboard.press(shortcuts.enter);
  await window.waitForTimeout(2000);

  console.log("File operations completed successfully");
  
  // Close VS Code
  await app.close();
});

test('Navigate through all options of VS Code', async () => {
  // Adjust path for your OS
  console.log(process.platform);
  const vscodePath =
    process.platform === 'darwin'
      ? '/Applications/Visual Studio Code.app/Contents/MacOS/Electron'
      : process.platform === 'win32'
      ? 'C:\\\\Program Files\\\\Microsoft VS Code\\\\Code.exe'
      //'C:\\\\Users\\\\ltuser.ghtestVM\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe'
       //'C:\\\\Users\\\\gauravc\\\\AppData\\\\Local\\\\Programs\\\\Microsoft VS Code\\\\Code.exe'
      : '/usr/share/code/code';

  // Launch VS Code with current folder
  const currentDir = process.cwd();
  console.log("Opening folder:", currentDir);
  const app = await electron.launch({ 
    executablePath: vscodePath,
    args: [currentDir, '--disable-workspace-trust'] // Open current folder
  });


  const window = await app.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  
  // Maximize the window using Playwright
  await window.evaluate(() => {
    if (window.electronAPI && window.electronAPI.maximize) {
      window.electronAPI.maximize();
    } else {
      // Fallback: try to maximize using browser APIs
      window.moveTo(0, 0);
      window.resizeTo(screen.width, screen.height);
    }
  });
  
  // Wait for VS Code to fully initialize and load the folder
  await window.waitForTimeout(5000);
  console.log("VS Code launched and folder loaded");

  // 1. Open Extensions view using platform-specific shortcut
  console.log("Opening Extensions view");
  await window.keyboard.press(shortcuts.extensions);
  await window.waitForTimeout(3000);

  // 2. Open Search view using platform-specific shortcut
  console.log("Opening Search view");
  await window.keyboard.press(shortcuts.search);
  await window.waitForTimeout(3000);

  // 3. Open Source Control view using platform-specific shortcut
  console.log("Opening Source Control view");
  await window.keyboard.press(shortcuts.sourceControl);
  await window.waitForTimeout(3000);

  // 4. Open Explorer view using platform-specific shortcut
  console.log("Opening Explorer view");
  await window.keyboard.press(shortcuts.explorer);
  await window.waitForTimeout(3000);

  // Close VS Code
  await app.close();
});
