<?php
require __DIR__ . '/vendor/autoload.php';


use Google\Client;
use Google\Service\Sheets;

// Eensuring that the method called is POst 
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// collect and sanitize form data
$name = isset($_POST['Complete_Name']) ? trim($_POST['Complete_Name']) : '';
$email = isset($_POST['Email_Address']) ? trim($_POST['Email_Address']) : '';
$phone = isset($_POST['Phone_No']) ? trim($_POST['Phone_No']) : '';
$consultMethod = isset($_POST['consult_method']) ? trim($_POST['consult_method']) : '';

// Validate form fields
if (empty($name) || empty($email) || empty($phone) || empty($consultMethod)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}

// Define recipient email addresses
$adminEmail = 'androtechbuddy@gmail.com';
$userEmail = $email;

// Send emails
$adminEmailSent = sendAdminEmail($adminEmail, $name, $email, $phone, $consultMethod);
$userEmailSent = sendUserEmail($userEmail, $name);

// Update Google Spreadsheet
$spreadsheetUpdated = updateGoogleSpreadsheet($name, $email, $phone, $consultMethod);

if ($adminEmailSent && $userEmailSent && $spreadsheetUpdated) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Your request has been submitted successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'There was an error processing your request. Please try again later.']);
}

function sendAdminEmail($to, $name, $email, $phone, $consultMethod)
{
    $subject = 'New Free Trial Request From Andro Buddy';
    $message = "
    <html>
    <body>
        <h2>New Free Trial Request</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Preferred Consult Method:</strong> $consultMethod</p>
    </body>
    </html>
    ";
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";

    return mail($to, $subject, $message, $headers);
}

function sendUserEmail($to, $name)
{
    $subject = 'Welcome to Andro Buddy Free Trial';
    $message = "
    <html>
    <body>
        <h2>Welcome to Andro Buddy, $name!</h2>
        <p>Thank you for signing up for our free trial. We're excited to have you on board!</p>
        <p>Our team will contact you shortly to get you started with your digital marketing journey.</p>
        <p>Best regards,<br>The Andro Buddy Team</p>
    </body>
    </html>
    ";
    $headers = "From: androtechbuddy@gmail.com\r\n";
    $headers .= "Reply-To: androtechbuddy@gmail.com\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";

    return mail($to, $subject, $message, $headers);
}

function updateGoogleSpreadsheet($name, $email, $phone, $consultMethod)
{
    $client = new Client();
    $client->setApplicationName('Andro Buddy Form Submissions');
    $client->setScopes(Sheets::SPREADSHEETS);
    $client->setAuthConfig('path/to/your/credentials.json');
    $client->setAccessType('offline');

    $service = new Google_Service_Sheets($client);

    // we have to replace the placeholder with actual spreadsheet ID
    $spreadsheetId = 'your-spreadsheet-id';
    $range = 'Sheet1!A:D';

    $values = [
        [$name, $email, $phone, $consultMethod]
    ];
    $body = new Sheets\ValueRange([
        'values' => $values
    ]);
    $params = [
        'valueInputOption' => 'RAW'
    ];

    try {
        $result = $service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);
        return true;
    } catch (Exception $e) {
        error_log('Error updating Google Spreadsheet: ' . $e->getMessage());
        return false;
    }
}
