#!/bin/bash

# Vérifie si un tag a été passé en argument
if [ -z "$1" ]; then
  echo "Erreur : Vous devez fournir un tag pour l'image Docker."
  echo "Usage : ./deploy.sh <nouveau-tag>"
  exit 1
fi

TAG=$1
PROD_DIR=~/lab2/prod
COMPOSE_FILE=$PROD_DIR/docker-compose.yml
IMAGE_NAME="vasilii31/lab2" # Remplace par le nom de ton image si différent

echo "1. Pull du dépôt Git..."
git pull || { echo "Erreur : Échec du git pull"; exit 1; }

echo "2. Build de l'image avec le tag $TAG..."
sudo docker build -t $IMAGE_NAME:$TAG . || { echo "Erreur : Build échoué"; exit 1; }

echo "3. Push de l'image avec le tag $TAG..."
sudo docker push $IMAGE_NAME:$TAG || { echo "Erreur : Push echoue"; exit 1;}

echo "4. Passage dans le dossier $PROD_DIR..."
cd $PROD_DIR || { echo "Erreur : Répertoire $PROD_DIR introuvable"; exit 1; }

echo "5. Arrêt des conteneurs existants..."
sudo docker compose down

echo "5. Mise à jour du tag dans le docker-compose.yml..."
sudo sed -i.bak -E "s|image: $IMAGE_NAME:.*|image: $IMAGE_NAME:$TAG|" "$COMPOSE_FILE"

echo "6. Redémarrage des conteneurs avec le nouveau tag..."
sudo docker compose up -d

echo "Déploiement terminé avec l'image : $IMAGE_NAME:$TAG"
