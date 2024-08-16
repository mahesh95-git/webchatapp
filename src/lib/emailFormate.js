const emailVerificationFormate = (name, url) => {
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
            color: white;
            background-color: #1f2937;
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
        
        <div class="email-body">
            <h1>Welcome to Coffee Chat!</h1>
            <p>Hi ${name},</p>
            <p>Thank you for signing up with us. We're excited to have you on board! To get started, please verify your email address by clicking the button below:</p>
           <div>verification token : ${url}</div>
            <a href=${url} class="verify-button">Verify Your Email</a>
            <p>If you did not create an account, please ignore this email.</p>
       
        <div class="email-footer">
            <p>&copy; 2024 NiceChat. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};

const forgotPasswordEmailFormate = (name, url) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #007bff;
            border-radius: 8px 8px 0 0;
            color: #ffffff;
        }

        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }

        .email-body h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .email-body p {
            margin-bottom: 20px;
        }

        .email-button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }

        .email-footer {
            text-align: center;
            padding: 20px;
            color: #888888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="email-body">
            <h1>Hello ${name},</h1>
            <p>We received a request to reset your password. If you didn’t request this, please ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            
            <p><a href=${url} class="email-button">Reset Password</a></p>
            <p>This link will expire in 24 hours. If you continue to have issues, please contact our support team.</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Coffee Chat. All rights reserved.</p>
           
        </div>
    </div>
</body>
</html>
`
}

export {emailVerificationFormate,forgotPasswordEmailFormate} 
