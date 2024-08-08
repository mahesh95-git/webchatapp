const emailFormate=(name,url)=>{
   
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #e9ecef;
            color: #333;
        }
        .email-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-header img {
            max-width: 120px;
            height: auto;
        }
        .email-body {
            padding: 20px;
            text-align: center;
        }
        .email-body h1 {
            color: #007bff;
            font-size: 24px;
            margin-bottom: 15px;
        }
        .email-body p {
            font-size: 16px;
            margin: 10px 0;
            line-height: 1.6;
        }
        .verify-button {
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #28a745;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        .verify-button:hover {
            background-color: #218838;
        }
        .email-footer {
            background-color: #f1f1f1;
            color: #777;
            font-size: 14px;
            text-align: center;
            padding: 10px;
            border-top: 1px solid #e2e2e2;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-header">
            <img src="https://example.com/logo.png" alt="Company Logo">
        </div>
        <div class="email-body">
            <h1>Welcome to NiceChat!</h1>
            <p>Hi ${name},</p>
            <p>Thank you for signing up with us. We're excited to have you on board! To get started, please verify your email address by clicking the button below:</p>
            verification token : ${url}
            <a href=${url} class="verify-button">Verify Your Email</a>
            <p>If you did not create an account, please ignore this email.</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 NiceChat. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
}

export default emailFormate;