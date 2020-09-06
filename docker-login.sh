if [ -z $DOCKER_PASSWORD ]; then
  echo "must provide DOCKER_PASSWORD for private repo";
  exit 1;
fi
echo $DOCKER_PASSWORD | docker login --username rabelais --password-stdin