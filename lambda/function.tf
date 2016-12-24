resource "aws_iam_role" "iam_for_dark_bot" {
    name = "iam_for_dark_bot"
    assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource "aws_lambda_function" "dark_bot" {
    filename = "dark_bot.zip"
    function_name = "dark_bot"
    role = "${aws_iam_role.iam_for_dark_bot.arn}"
    handler = "exports.handler"
    source_code_hash = "${base64sha256(file("dark_bot.zip"))}"
    runtime = "nodejs4.3"
}
