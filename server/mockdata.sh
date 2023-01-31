#!/bin/bash

files=./mockdata/*.csv

for file in $files
do
  splitPoint=(${file//./ })[0]
  arrName=(${splitPoint//_/ })[2]
  docker exec -i mongo_chat sh -c $(mongoimport --host=127.0.0.1 -d bike-kings -c $arrName --type csv --file $file --headerline)
done
