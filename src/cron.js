const cron = require("node-cron");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// Define the URL of your health check APIs
const healthCheckUrl = process.env.HEALTH_CHECK_URL; // Update with your actual URL

// Schedule a cron job to run every 10 minutes
cron.schedule("process.env.CRON_TIME", async () => {
  try {
    const response = await axios.get(healthCheckUrl);
    if (response.data.status === "OK") {
      console.log("Health check passed:", new Date());
    } else {
      console.error("Health check failed:", new Date());
    }
  } catch (error) {
    console.error("Error calling health check API:", error.message);
  }
});
