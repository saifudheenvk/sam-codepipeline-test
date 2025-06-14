#create s3 bucket

aws s3 mb s3://saifu-codesam --profile user1

#package cloudformation template

aws cloudformation package --template-file template.yaml --s3-bucket saifu-codesam --output-template-file gen/packaged.yaml --profile user1

#deploy cloudformation template

aws cloudformation deploy --template-file gen/packaged.yaml --stack-name test-stack --capabilities CAPABILITY_IAM --profile user1