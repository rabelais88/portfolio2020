VERSION="test"
IMAGE_NAME="rabelais/portfolio_front_www" # public repo!
TAG_FIXED="${IMAGE_NAME}:${VERSION}"
TAG_LATEST="${IMAGE_NAME}:latest"
docker build -f prod.dockerfile -t $TAG_FIXED .
docker tag $TAG_FIXED $TAG_LATEST
docker push $TAG_LATEST
