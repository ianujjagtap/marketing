# Detailed Instructions for Integrating Google Sheets with Your PHP Form

This document provides a step-by-step guide to capturing form submissions on your website and storing them in a Google Sheet. This involves setting up the Google Sheets API, installing the necessary PHP library, and configuring your PHP code to handle form data and send it to the spreadsheet.

---

## I. Google Sheets API Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. If you don't have a project already, create one:
   - Click **Select a project** and then **NEW PROJECT**.
   - Give your project a name and click **Create**.

### 2. Enable the Google Sheets API

1. In the Cloud Console, navigate to the **APIs & Services** dashboard.
   - You can find it by searching for "APIs & Services" in the top search bar.
2. Click **ENABLE APIS AND SERVICES**.
   - Search for **Google Sheets API** and click on it.
3. Click the **ENABLE** button.

### 3. Create a Service Account

1. In the Cloud Console, go to **IAM & Admin** -> **Service Accounts**.
2. Click **CREATE SERVICE ACCOUNT**:
   - Give your service account a name and description.
   - Click **CREATE AND CONTINUE**.
3. Grant the service account the **Editor** role on Google Sheets:
   - Select the **Editor** role and click **CONTINUE**.
   - Skip the "Grant users access to this service account" step by clicking **DONE**.
4. In the list of service accounts, locate the one you just created.
   - Click the three dots in the **Actions** column and select **Manage keys**.
5. Click **ADD KEY** -> **Create new key**:
   - Choose **JSON** as the key type and click **CREATE**.
   - A JSON file containing your service account credentials will be downloaded. Store this file securely and do not share it publicly. This is your `credentials.json` file.

### 4. Share Your Google Sheet

1. Open the Google Sheet you want to use to store the form data.
2. Click the **Share** button in the top right corner.
3. In the **Share with people and groups** field, enter the email address of the service account you created (found in the `credentials.json` file).
4. Ensure the permission is set to **Editor** and then click **Send**.

---

## II. PHP Setup and Code Integration

### 1. Install Composer

- If you don't have Composer installed on your system, download and install it from [https://getcomposer.org/download/](https://getcomposer.org/download/).

### 2. Install the Google API Client Library

1. Open your terminal or command prompt and navigate to the root directory of your PHP project (where your `composer.json` file is).
2. Run the following command:

   ```sh
   composer require google/apiclient:^2.0
   ```

### 3. PHP Code

In your PHP form handling script (e.g., `form-handler.php`), add the following code. Remember to replace the placeholders with your actual values.

```php
<?php

require __DIR__ . '/vendor/autoload.php'; // Include Composer autoloader

use Google\Client;
use Google\Service\Sheets;

// ... Your existing form handling and email code ...

// Sanitize and collect form data (Important for security)
$name = isset($_POST['Complete_Name']) ? htmlspecialchars(trim($_POST['Complete_Name'])) : '';
$email = isset($_POST['Email_Address']) ? filter_var(trim($_POST['Email_Address']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['Phone_No']) ? htmlspecialchars(trim($_POST['Phone_No'])) : '';
$consultMethod = isset($_POST['consult_method']) ? htmlspecialchars(trim($_POST['consult_method'])) : '';

// ... your other code ...

function updateGoogleSpreadsheet($name, $email, $phone, $consultMethod) {
    $client = new Client();
    $client->setApplicationName('Andro Buddy Form Submissions');  // Or a suitable name for your application
    $client->setScopes(Sheets::SPREADSHEETS);

    // *** REPLACE with your actual path ***
    $client->setAuthConfig(__DIR__ . '/path/to/your/credentials.json'); // Path to your downloaded credentials.json
    $client->setAccessType('offline');

    $service = new Sheets($client);

    // *** REPLACE with your actual spreadsheet ID ***
    $spreadsheetId = 'YOUR_SPREADSHEET_ID'; // The ID of your Google Sheet
    $range = 'Sheet1!A:D'; // The sheet and columns where data will be added

    $values = [[$name, $email, $phone, $consultMethod]]; // Data to be inserted

    $body = new Sheets\ValueRange(['values' => $values]);
    $params = ['valueInputOption' => 'RAW']; // Insert data exactly as provided (important for numbers and dates)

    try {
        $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);
        return true;
    } catch (Exception $e) {
        // Handle the exception (e.g., log the error, display an error message)
        echo json_encode(['status' => 'error', 'message' => 'Error saving data: ' . $e->getMessage()]);
        error_log('Error updating Google Spreadsheet: ' . $e->getMessage());
        exit;
    }
}

// Call the function after successful form submission and email sending
if ($adminEmailSent && $userEmailSent) { // Assuming you have variables like this to check if email was sent
    $spreadsheetUpdated = updateGoogleSpreadsheet($name, $email, $phone, $consultMethod);
    if ($spreadsheetUpdated) {
        echo json_encode(['status' => 'success']);
    } 
}

?>
```

### 4. Secure Your Credentials

- Place the `credentials.json` file **outside** of your web server's public document root (e.g., `public_html`, `htdocs`). This will prevent direct access to the file through a browser.

---

## III. Testing

1. **Submit Your Form**:
   - Fill out and submit your form on the website.

2. **Check Your Google Sheet**:
   - The submitted data should appear in a new row.

3. **Check for Errors**:
   - If the data doesn't appear, check your web server's error logs for any error messages related to the Google Sheets API integration.

---

This comprehensive guide will help you integrate Google Sheets with your PHP form submissions securely and efficiently. Remember to replace the placeholder values with your own and test thoroughly. If you encounter issues, double-check the credentials path, spreadsheet ID, service account permissions, and API library installation. Review error logs for more specific error messages.