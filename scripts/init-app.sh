#!/bin/bash

# stop on first error
set -e

# warn: very slow task, be patient!
npm run bin

mkdir -p bin

cp ./backend-files/* bin/
chmod +x bin/apropriacao.sh bin/geckodriver bin/chromedriver

mv tasks-linux-x64/ bin/

echo "Executando bin/tasks-linux-x64/tasks..."

bin/tasks-linux-x64/tasks &
