# PiCloudStorage

This is a Next.js application for managing and viewing your personal media files.

## How File Storage Works (Current State)

**Important:** This application is currently a prototype. It uses mock data to simulate a library of files and folders. When you upload a file, it is **only stored in your browser's memory** for the duration of your session. It is **not** saved to the Raspberry Pi's file system.

To implement persistent storage, you would need to:
1.  Create a designated folder on your Raspberry Pi to store the media (e.g., `/home/pi/pimedia`).
2.  Implement backend logic (e.g., using Next.js API Routes or Server Actions) to handle file uploads, deletions, and listings by interacting with the Pi's file system.
3.  Replace the mock data in the frontend with API calls to your new backend.

## Running on a Raspberry Pi

To run this application on a Raspberry Pi, follow these steps.

### 1. Set Up Your Raspberry Pi

First, you need to have Node.js and npm (Node Package Manager) installed on your Raspberry Pi. It's recommended to use a recent version of Node.js (e.g., v18 or later).

You can open a terminal on your Raspberry Pi and run these commands to install Node.js:

```bash
# Downloads and runs the NodeSource setup script for Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Installs Node.js and npm
sudo apt-get install -y nodejs
```

Verify the installation:
```bash
node -v
npm -v
```

### 2. Get Your Code

Clone your project from your GitHub repository onto the Raspberry Pi:

```bash
# Replace <YOUR_REPOSITORY_URL> with the actual URL from GitHub
git clone <YOUR_REPOSITORY_URL>
cd your-project-name
```

### 3. Install Dependencies

Install the necessary packages for the project:

```bash
npm install
```

### 4. Build the Application

Create an optimized production build of your Next.js app. This might take a few minutes on a Raspberry Pi.

```bash
npm run build
```

### 5. Run the Application

Start the production server. The app will typically be available at `http://<YOUR_RASPBERRY_PI_IP>:3000`.

```bash
npm run start
```

Your PiCloudStorage should now be running on your Raspberry Pi!
