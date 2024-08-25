<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);
$mail->CharSet = "UTF-8";

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'sssamonsk@gmail.com';                     //SMTP username
    $mail->Password   = 'itsc zyld otxp bxes';                     //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    //Recipients
    $mail->setFrom('sssamonsk@gmail.com', 'Automated Form System');
    $mail->addAddress('sssamonsk@gmail.com', 'Joe User');     //Add a recipient

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Submission from {$_POST['name']} at " . ($_POST['company'] ?? "**NaN**");

    // Format the email body
    $body = "<h2>New Form Submission</h2>";

    $body .= "<h3>Contact Information:</h3>";
    $body .= "<p><strong>Name:</strong> {$_POST['name']}</p>";
    $body .= "<p><strong>Email:</strong> {$_POST['email']}</p>";
    $body .= "<p><strong>Phone:</strong> {$_POST['phone']}</p>";
    $body .= "<p><strong>Company:</strong> " . ($_POST['company'] ?? "**NaN**") . "</p>";
    $body .= "<p><strong>Phone Type:</strong> " . ($_POST['phone-number-type'] ?? "**NaN**") . "</p>";
    $body .= "<p><strong>Country from ip address:</strong> " . ($_POST['ip-country'] ?? "**NaN**") . "</p>";

    if (isset($_POST['message'])) {
        $body .= "<h3>Message:</h3>";
        $body .= "<p>{$_POST['message']}</p>";
    } else if (isset($_POST['house-description'])) {
        $body .= "<h3>Form Answers:</h3>";
        $body .= "<p><strong>Description of Their Property:</strong> " . ($_POST['house-description'] ?? "**NaN**") . "</p>";
        $body .= "<p><strong>WiFi Connection:</strong> " . ($_POST['wifi-option'] ?? "**NaN**") . "</p>";
        $body .= "<p><strong>WiFi Access In All Rooms:</strong> " . ($_POST['wifi-access-option'] ?? "**NaN**") . "</p>";
        $body .= "<p><strong>Appliances They Would Like to Connect:</strong> " . ($_POST['appliances-to-connect'] ?? "**NaN**") . "</p>";
    }

    $mail->Body = $body;

    // Attachments
    if (isset($_FILES['file']) && !empty($_FILES['file']['name'][0])) {
        foreach ($_FILES['file']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['file']['error'][$key] === UPLOAD_ERR_OK) {
                $mail->addAttachment($tmp_name, $_FILES['file']['name'][$key]);
            } else {
                error_log('Error uploading file: ' . $_FILES['file']['error'][$key]);
            }
        }
    } else {
        error_log('No files uploaded.');
    }

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Message has been sent']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}