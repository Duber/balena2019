
param(
    $acrName,
    $acrUsername,
    $acrPassword,
    $imgName
)

docker build -t $imgName -f Dockerfile.server .
# docker run -e "SERVER_PORT=8081" -p 8081:8081 $imgName

az acr login --name $acrName --username $acrUsername --password $acrPassword

$registry = "$($acrName).azurecr.io"
docker login $registry
docker push "$($imgName):latest"