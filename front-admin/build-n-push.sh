if [ -z $DOCKER_PASSWORD ]
then
  echo "must provide DOCKER_PASSWORD for private repo";
  exit 1;
fi
echo $DOCKER_PASSWORD | docker login --username rabelais --password-stdin
VERSION="test"
IMAGE_NAME="rabelais/portfolio_front_admin" # public repo!
TAG_FIXED="${IMAGE_NAME}:${VERSION}"
TAG_LATEST="${IMAGE_NAME}:latest"
docker build -f prod.dockerfile -t $TAG_FIXED .
docker tag $TAG_FIXED $TAG_LATEST
docker push $TAG_LATEST
