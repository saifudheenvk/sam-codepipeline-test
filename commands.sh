#create s3 bucket

aws s3 mb s3://saifu-codesam --profile user1

#package cloudformation template

aws cloudformation package --template-file template.yaml --s3-bucket saifu-codesam --output-template-file gen/packaged.yaml --profile user1

#deploy cloudformation template
GITHUB_TOKEN_ARN=arn:aws:secretsmanager:us-east-1:597088052511:secret:GithubToken-SoLOTi
export GITHUB_TOKEN=$(aws secretsmanager get-secret-value --secret-id $GITHUB_TOKEN_ARN --query SecretString --output text --profile user1 | jq -r .GITHUB_TOKEN)

#aws cloudformation deploy --template-file gen/packaged.yaml --stack-name test-stack --capabilities CAPABILITY_IAM --parameter-overrides GitHubOwner=saifudheenvk GitHubRepo=sam-codepipeline-test GitHubBranch=master GitHubToken=$GITHUB_TOKEN --profile user1

aws cloudformation deploy \
  --template-file gen/packaged.yaml \
  --stack-name test-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    GitHubOwner=saifudheenvk \
    GitHubRepo=sam-codepipeline-test \
    GitHubBranch=master \
    GitHubToken=$GITHUB_TOKEN \
  --profile user1