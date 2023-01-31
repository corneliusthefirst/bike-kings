# bike-kings
# Pour tester le front et back en docker local

cd client
yarn install
yarn start

cd server
yarn install
yarn docker:dev
yarn dev

# pensez a re cliquer sur la discussion pour reloader le chat avant de faire des tests, aussi a reload la page si la mis a jour apres une action n'est pas visible

# pour le chatbot si il ya des ancien donnée vous pouvez fermer sur la crois en haut droite pour reinitializé

# restart le server "yarn dev" si une erreur subvient et des donnees ou scoket ne fonctionne plus comme prevu

# Nous avons dans le dossier mockdata des csv de base de donnée mongodb mais nous avons pas reussi a faire marcher le script pour son ajout automatique.