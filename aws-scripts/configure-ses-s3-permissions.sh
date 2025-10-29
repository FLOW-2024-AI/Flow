#!/bin/bash

# Configuration
BUCKET_NAME="flow-facturas-2"
AWS_ACCOUNT_ID="886436955626"
REGION="us-east-1"

# Create bucket policy to allow SES to write emails
cat > /tmp/ses-bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSESPuts",
      "Effect": "Allow",
      "Principal": {
        "Service": "ses.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/incoming-emails/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceAccount": "${AWS_ACCOUNT_ID}"
        },
        "StringLike": {
          "AWS:SourceArn": "arn:aws:ses:${REGION}:${AWS_ACCOUNT_ID}:receipt-rule-set/*"
        }
      }
    }
  ]
}
EOF

# Apply the bucket policy
echo "Applying bucket policy to allow SES to write to $BUCKET_NAME..."
aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/ses-bucket-policy.json

if [ $? -eq 0 ]; then
    echo "✓ Bucket policy applied successfully"

    # Now update the SES receipt rule
    echo "Updating SES receipt rule..."
    aws ses update-receipt-rule \
      --rule-set-name "inbound-email-rule-set" \
      --rule '{
        "Name": "inbound-email-rule",
        "Enabled": true,
        "Recipients": ["demo@flow-cfo-facturas.com"],
        "Actions": [
          {
            "S3Action": {
              "BucketName": "'"$BUCKET_NAME"'",
              "ObjectKeyPrefix": "incoming-emails/"
            }
          },
          {
            "SNSAction": {
              "TopicArn": "arn:aws:sns:'"$REGION"':'"$AWS_ACCOUNT_ID"':facturas-lambda",
              "Encoding": "UTF-8"
            }
          }
        ],
        "ScanEnabled": true
      }'

    if [ $? -eq 0 ]; then
        echo "✓ SES receipt rule updated successfully"
    else
        echo "✗ Failed to update SES receipt rule"
        exit 1
    fi
else
    echo "✗ Failed to apply bucket policy"
    exit 1
fi

# Clean up
rm /tmp/ses-bucket-policy.json

echo ""
echo "Configuration complete!"
echo "Now emails to demo@flow-cfo-facturas.com will be saved to s3://$BUCKET_NAME/incoming-emails/"
