git pull origin main;
kill -9 $(lsof -i -n -P | grep LISTEN | grep 3002 | awk {'print $2'})
mv --backup=t log.log backup_log.log
npm start >> log.log &
disown $1
