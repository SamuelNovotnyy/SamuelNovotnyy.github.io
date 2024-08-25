<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Make sure this path is correct

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->isSMTP();                                            // Send using SMTP
    $mail->isSMTP();
$mail->Host       = 'smtp.gmail.com';
$mail->SMTPAuth   = true;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port       = 587; // Use 465 for SSL                     // Set the SMTP server to send through                                  // Enable SMTP authentication
    $mail->Username   = 'sssamonsk@gmail.com';                 // SMTP username (your Gmail address)
    $mail->Password   = 'rctz biur nefr vrf';        // SMTP password (your Gmail password or app-specific password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted

    //Recipients
    $mail->setFrom('sssamonsk@gmail.com', 'Samuel Novotny');        // Sender's email and name
    $mail->addAddress('recipient@example.com');                 // Add a recipient (you can add multiple recipients if needed)

    // Content
    $mail->isHTML(true);                                        // Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>