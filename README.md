# PiCloudStorage

This is a Next.js application for managing and viewing your personal media files.

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
